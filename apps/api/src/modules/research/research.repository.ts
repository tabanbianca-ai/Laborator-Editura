import { Inject, Injectable } from "@nestjs/common";
import { getDefaultRuntimeDatabase, type FileBackedRuntimeDatabase } from "@laborator/db";
import { RUNTIME_DATABASE } from "../runtime-database.provider";
import {
  type ResearchAuditEvent,
  type ResearchCollection,
  type ResearchCollectionItem,
  type ResearchEntity,
  type ResearchNote,
  type ResearchRelationship,
  type ResearchRepository,
  type ResearchSource
} from "./research.types";

@Injectable()
export class DatabaseResearchRepository implements ResearchRepository {
  constructor(
    @Inject(RUNTIME_DATABASE)
    private readonly database: FileBackedRuntimeDatabase = getDefaultRuntimeDatabase()
  ) {}

  async createSource(source: ResearchSource): Promise<ResearchSource> {
    return this.database.insert("research_sources", source);
  }

  async listSources(organizationId: string): Promise<ResearchSource[]> {
    return this.database.selectForTenant<ResearchSource>("research_sources", organizationId);
  }

  async findSourceById(id: string, organizationId: string): Promise<ResearchSource | null> {
    return this.database.findByIdForTenant<ResearchSource>("research_sources", id, organizationId);
  }

  async createNote(note: ResearchNote): Promise<ResearchNote> {
    return this.database.insert("research_notes", note);
  }

  async listNotes(organizationId: string): Promise<ResearchNote[]> {
    return this.database.selectForTenant<ResearchNote>("research_notes", organizationId);
  }

  async createEntity(entity: ResearchEntity): Promise<ResearchEntity> {
    return this.database.insert("research_entities", entity);
  }

  async listEntities(organizationId: string): Promise<ResearchEntity[]> {
    return this.database.selectForTenant<ResearchEntity>("research_entities", organizationId);
  }

  async findEntityById(id: string, organizationId: string): Promise<ResearchEntity | null> {
    return this.database.findByIdForTenant<ResearchEntity>("research_entities", id, organizationId);
  }

  async createRelationship(relationship: ResearchRelationship): Promise<ResearchRelationship> {
    return this.database.insert("research_relationships", relationship);
  }

  async listRelationships(organizationId: string): Promise<ResearchRelationship[]> {
    return this.database.selectForTenant<ResearchRelationship>("research_relationships", organizationId);
  }

  async createCollection(collection: ResearchCollection): Promise<ResearchCollection> {
    return this.database.insert("research_collections", collection);
  }

  async listCollections(organizationId: string): Promise<ResearchCollection[]> {
    return this.database.selectForTenant<ResearchCollection>("research_collections", organizationId);
  }

  async findCollectionById(id: string, organizationId: string): Promise<ResearchCollection | null> {
    return this.database.findByIdForTenant<ResearchCollection>("research_collections", id, organizationId);
  }

  async createCollectionItem(item: ResearchCollectionItem): Promise<ResearchCollectionItem> {
    return this.database.insert("research_collection_items", item);
  }

  async appendAuditEvent(event: ResearchAuditEvent): Promise<void> {
    this.database.insert("research_audit_events", event);
  }
}
