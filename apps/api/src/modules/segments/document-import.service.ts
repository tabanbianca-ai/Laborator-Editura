import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  PayloadTooLargeException,
  UnsupportedMediaTypeException
} from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import * as mammoth from "mammoth";
import { DocumentsService } from "../documents/documents.service";
import {
  type CanonicalDocumentBlock,
  type DocxImportInput,
  type Document,
  type DocumentActor,
  type ParsedDocxDocument,
  type UploadedDocxFile
} from "../documents/documents.types";
import { WorkflowService } from "../workflow/workflow.service";
import { SegmentsService } from "./segments.service";
import { type Segment } from "./segments.types";

const DOCX_MEDIA_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MAX_DOCX_BYTES = 8 * 1024 * 1024;
const ZIP_SIGNATURES = ["504b0304", "504b0506", "504b0708"];

export interface DocxImportResult {
  document: Document;
  duplicate: boolean;
  segments: Segment[];
  unsupportedElements: string[];
}

@Injectable()
export class DocumentImportService {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly segmentsService: SegmentsService,
    private readonly workflowService: WorkflowService
  ) {}

  async importDocx(
    actor: DocumentActor,
    file: UploadedDocxFile | undefined,
    input: DocxImportInput
  ): Promise<DocxImportResult> {
    this.assertAuthorized(actor);
    this.validateFile(file);

    if (!input.projectId || !input.originalLanguage || !input.targetLanguage) {
      throw new BadRequestException(
        "projectId, originalLanguage and targetLanguage are required."
      );
    }

    const checksum = createHash("sha256").update(file.buffer).digest("hex");
    const existing = await this.documentsService.findByImportChecksum(
      actor,
      input.projectId,
      checksum
    );

    if (existing) {
      const segments = await this.segmentsService.listSegments(actor, existing.id);
      await this.workflowService.startWorkflow(actor, {
        projectId: existing.projectId,
        documentId: existing.id,
        scope: "DOCUMENT"
      });
      return {
        document: existing,
        duplicate: true,
        segments,
        unsupportedElements: this.readStringArray(existing.metadata?.unsupportedDocxElements)
      };
    }

    const parsed = await this.parseDocx(file.buffer, checksum);

    if (parsed.blocks.length === 0) {
      throw new BadRequestException("The DOCX document contains no importable textual content.");
    }

    const document = await this.documentsService.createDocument(actor, {
      projectId: input.projectId,
      title: input.title?.trim() || this.titleFromFilename(file.originalname),
      sourceLanguage: input.originalLanguage,
      originalLanguage: input.originalLanguage,
      originalLocale: input.originalLocale,
      authoringLanguage: input.authoringLanguage ?? input.originalLanguage,
      authoringLocale: input.authoringLocale ?? input.originalLocale,
      targetLanguage: input.targetLanguage,
      targetLocale: input.targetLocale,
      documentType: "DOCX",
      translatorName: input.translatorName,
      originalAuthorName: input.originalAuthorName,
      metadata: {
        canonicalBlocks: parsed.blocks,
        canonicalHtml: parsed.canonicalHtml,
        importFormatVersion: "1.0",
        importedAt: new Date().toISOString(),
        imageCount: parsed.imageCount,
        originalFileName: file.originalname,
        originalMediaType: DOCX_MEDIA_TYPE,
        originalSizeBytes: file.size,
        originalSourceBase64: file.buffer.toString("base64"),
        originalSourcePreserved: true,
        originalSourceSha256: checksum,
        unsupportedDocxElements: parsed.messages
      }
    });
    const segments = await this.segmentsService.createCanonicalSegments(
      actor,
      parsed.blocks.map((block, index) => ({
        documentId: document.id,
        metadata: {
          blockHtml: block.html,
          blockType: block.type,
          headingLevel: block.headingLevel,
          listType: block.listType,
          sourceReference: block.sourceReference
        },
        order: index + 1,
        projectId: document.projectId,
        sourceBlockId: block.id,
        sourceBlockOrder: block.order,
        sourceChecksum: checksum,
        sourceLanguage: document.sourceLanguage,
        sourceLocale: document.originalLocale,
        sourceText: block.text,
        sourceVersion: 1,
        targetLanguage: document.targetLanguage,
        targetLocale: document.targetLocale
      }))
    );

    await this.workflowService.startWorkflow(actor, {
      projectId: document.projectId,
      documentId: document.id,
      scope: "DOCUMENT",
      metadata: {
        importedFrom: "DOCX",
        sourceChecksum: checksum
      }
    });

    return {
      document,
      duplicate: false,
      segments,
      unsupportedElements: parsed.messages
    };
  }

  private async parseDocx(buffer: Buffer, checksum: string): Promise<ParsedDocxDocument> {
    const result = await mammoth.convertToHtml(
      { buffer },
      {
        convertImage: mammoth.images.imgElement(async (image) => {
          const base64 = await image.read("base64");
          return { src: `data:${image.contentType};base64,${base64}` };
        }),
        includeDefaultStyleMap: true
      }
    );
    const blocks = this.extractBlocks(result.value, checksum);
    const messages = result.messages.map((message) => `${message.type}: ${message.message}`);

    return {
      blocks,
      canonicalHtml: result.value,
      plainText: blocks.map((block) => block.text).join("\n\n"),
      messages,
      imageCount: (result.value.match(/<img\b/gi) ?? []).length
    };
  }

  private extractBlocks(html: string, checksum: string): CanonicalDocumentBlock[] {
    const blocks: CanonicalDocumentBlock[] = [];
    const blockPattern = /<(h[1-6]|p|ul|ol|table)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
    let match: RegExpExecArray | null;

    while ((match = blockPattern.exec(html)) !== null) {
      const tag = (match[1] ?? "").toLowerCase();
      const innerHtml = match[2] ?? "";

      if (tag === "ul" || tag === "ol") {
        const itemPattern = /<li([^>]*)>([\s\S]*?)<\/li>/gi;
        let itemMatch: RegExpExecArray | null;
        while ((itemMatch = itemPattern.exec(innerHtml)) !== null) {
          const attributes = itemMatch[1] ?? "";
          const itemHtml = itemMatch[2] ?? "";
          const noteType = /\bid=["']footnote-/i.test(attributes)
            ? "FOOTNOTE"
            : /\bid=["']endnote-/i.test(attributes)
              ? "ENDNOTE"
              : "LIST_ITEM";
          this.appendBlock(blocks, checksum, noteType, itemHtml, {
            listType: tag === "ol" ? "ORDERED" : "UNORDERED"
          });
        }
        continue;
      }

      const text = this.htmlToText(innerHtml);
      const lowerText = text.toLocaleLowerCase("en");
      const containsImage = /<img\b/i.test(innerHtml);
      const type = tag === "table"
        ? "TABLE"
        : tag.startsWith("h")
          ? "HEADING"
          : containsImage && !text
            ? "IMAGE"
          : lowerText.startsWith("figure ") || lowerText.startsWith("fig. ")
            ? "CAPTION"
            : "PARAGRAPH";
      this.appendBlock(blocks, checksum, type, innerHtml, {
        headingLevel: type === "HEADING" ? Number(tag.slice(1)) : undefined
      }, type === "IMAGE" ? "[Image]" : undefined);
    }

    return blocks;
  }

  private appendBlock(
    blocks: CanonicalDocumentBlock[],
    checksum: string,
    type: CanonicalDocumentBlock["type"],
    html: string,
    metadata: Pick<CanonicalDocumentBlock, "headingLevel" | "listType">,
    textOverride?: string
  ): void {
    const text = textOverride ?? this.htmlToText(html);
    if (!text) {
      return;
    }

    const order = blocks.length + 1;
    blocks.push({
      id: createHash("sha256")
        .update(`${checksum}:${order}:${type}:${text}`)
        .digest("hex")
        .slice(0, 32),
      order,
      type,
      text,
      html,
      headingLevel: metadata.headingLevel,
      listType: metadata.listType,
      sourceReference: `word/document.xml#block-${order}`
    });
  }

  private htmlToText(value: string): string {
    return value
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/p>|<\/li>|<\/tr>/gi, "\n")
      .replace(/<\/td>|<\/th>/gi, "\t")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  private validateFile(file: UploadedDocxFile | undefined): asserts file is UploadedDocxFile {
    if (!file) {
      throw new BadRequestException("A DOCX file is required.");
    }

    if (file.size <= 0 || file.buffer.length <= 0) {
      throw new BadRequestException("The uploaded DOCX file is empty.");
    }

    if (file.size > MAX_DOCX_BYTES) {
      throw new PayloadTooLargeException("DOCX files must not exceed 8 MiB.");
    }

    const extensionValid = file.originalname.toLocaleLowerCase("en").endsWith(".docx");
    const mimeValid = file.mimetype === DOCX_MEDIA_TYPE || file.mimetype === "application/octet-stream";
    const signatureValid = ZIP_SIGNATURES.includes(file.buffer.subarray(0, 4).toString("hex"));

    if (!extensionValid || !mimeValid || !signatureValid) {
      throw new UnsupportedMediaTypeException("Only valid DOCX files are accepted.");
    }
  }

  private assertAuthorized(actor: DocumentActor): void {
    const roles = new Set((actor.roles ?? []).map((role) => role.toUpperCase()));
    const permissions = new Set(actor.permissions ?? []);
    const permitted = permissions.has("document:write") ||
      permissions.has("document.write") ||
      ["PLATFORM_CREATOR", "ADMIN", "EDITOR", "AUTHOR", "TRANSLATOR"].some((role) => roles.has(role));

    if (!permitted) {
      throw new ForbiddenException("Document import requires document write permission.");
    }
  }

  private titleFromFilename(fileName: string): string {
    return fileName.replace(/\.docx$/i, "").trim() || `Imported manuscript ${randomUUID().slice(0, 8)}`;
  }

  private readStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  }
}
