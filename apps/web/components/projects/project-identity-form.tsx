"use client";

import { useMemo, useState } from "react";
import { createUiTranslator, type UiTranslationKey } from "../../lib/ui-i18n";
import type {
  ProjectCapability,
  ProjectOrigin,
  ProjectPublicationType,
  ProjectRightsStatus
} from "../../lib/projects-documents-api";
import { Badge, Button, Input, Select } from "../ui";

interface ProjectIdentityFormProps {
  action: (formData: FormData) => void | Promise<void>;
  platformLanguage?: string | null;
}

const projectOriginValues: ProjectOrigin[] = [
  "ORIGINAL_CREATION",
  "EXTERNAL_AUTHOR",
  "TRANSLATION",
  "EDITORIAL_COLLABORATION",
  "PUBLIC_DOMAIN_CLASSICAL_WORK",
  "MAGAZINE_ARTICLE",
  "CHILDRENS_BOOK",
  "AUDIO_VIDEO_PROJECT"
];

const rightsStatusValues: ProjectRightsStatus[] = [
  "ORIGINAL_CREATION",
  "RIGHTS_OBTAINED",
  "PUBLIC_DOMAIN",
  "CLASSICAL_WORK",
  "OPEN_LICENSE",
  "RIGHTS_PENDING",
  "RESTRICTED_PUBLICATION"
];

const publicationTypeValues: ProjectPublicationType[] = [
  "BOOK",
  "CHILDRENS_BOOK",
  "MAGAZINE",
  "POETRY",
  "DICTIONARY",
  "COURSE",
  "AUDIOBOOK",
  "VIDEO"
];

const capabilityValues: ProjectCapability[] = [
  "ILLUSTRATIONS",
  "TRANSLATION",
  "AUDIOBOOK",
  "VIDEO",
  "FLIPBOOK",
  "ACCESSIBILITY"
];

export function ProjectIdentityForm({ action, platformLanguage }: ProjectIdentityFormProps) {
  const ui = createUiTranslator(platformLanguage);
  const [projectOrigin, setProjectOrigin] = useState<ProjectOrigin>("ORIGINAL_CREATION");
  const [publicationType, setPublicationType] = useState<ProjectPublicationType>("BOOK");
  const [rightsStatus, setRightsStatus] = useState<ProjectRightsStatus>("ORIGINAL_CREATION");
  const requiresOriginalAuthor = projectOrigin !== "ORIGINAL_CREATION";
  const publicDomainSelected = rightsStatus === "PUBLIC_DOMAIN" || rightsStatus === "CLASSICAL_WORK";
  const flipbookAvailable = publicationType === "MAGAZINE";

  const originOptions = useMemo(
    () => projectOriginValues.map((value) => ({ label: labelForProjectOrigin(value, ui.t), value })),
    [ui]
  );
  const rightsStatusOptions = useMemo(
    () => rightsStatusValues.map((value) => ({ label: labelForRightsStatus(value, ui.t), value })),
    [ui]
  );
  const publicationTypeOptions = useMemo(
    () => publicationTypeValues.map((value) => ({ label: labelForPublicationType(value, ui.t), value })),
    [ui]
  );

  return (
    <form action={action} className="manuscript-form">
      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("label.projectIdentity")}</p>
            <h2>{ui.t("project.newProject")}</h2>
          </div>
          <Badge tone="warning">{ui.t("badge.required")}</Badge>
        </div>

        <p className="muted-text">{ui.t("project.createGuidance")}</p>

        <Input label={ui.t("project.title")} name="name" required />
        <label className="ui-input-field">
          <span>{ui.t("project.description")}</span>
          <textarea className="ui-input manuscript-textarea" name="description" rows={3} />
        </label>

        <div className="manuscript-form-grid">
          <Select
            label={ui.t("project.origin")}
            name="projectOrigin"
            onChange={(event) => setProjectOrigin(event.target.value as ProjectOrigin)}
            options={originOptions}
            required
            value={projectOrigin}
          />
          <Select
            label={ui.t("project.rightsStatus")}
            name="rightsStatus"
            onChange={(event) => setRightsStatus(event.target.value as ProjectRightsStatus)}
            options={rightsStatusOptions}
            required
            value={rightsStatus}
          />
        </div>

        {publicDomainSelected ? (
          <div className="rights-warning-banner rights-warning-banner-compact">
            <strong>{ui.t("project.publicDomain")}</strong>
            <p>{ui.t("project.publicDomainNotice")}</p>
          </div>
        ) : null}

        {requiresOriginalAuthor ? (
          <section className="content-panel">
            <div className="section-heading">
              <div>
                <p className="section-kicker">{ui.t("project.originalAuthor")}</p>
                <h3>{ui.t("project.originalAuthorHelp")}</h3>
              </div>
              <Badge tone="warning">{ui.t("badge.required")}</Badge>
            </div>
            <div className="manuscript-form-grid">
              <Input label={ui.t("project.authorName")} name="originalAuthorName" required />
              <Input label={ui.t("project.authorCountryOptional")} name="originalAuthorCountry" />
              <Input label={ui.t("project.originalLanguage")} name="originalAuthorLanguage" placeholder="fr" required />
            </div>
          </section>
        ) : null}

        <div className="manuscript-form-grid">
          <Input defaultValue="ro" label={ui.t("project.sourceLanguage")} name="sourceLanguage" required />
          <Input defaultValue="en" label={ui.t("project.targetLanguage")} name="targetLanguage" required />
          <Input defaultValue="en-US" label={ui.t("project.targetLocale")} name="targetLocale" />
        </div>
        <div className="manuscript-form-grid">
          <Input label={ui.t("project.originalLanguage")} name="originalLanguage" placeholder="Defaults to source language" />
          <Input label={ui.t("project.originalLocale")} name="originalLocale" placeholder="fr-FR, ro-RO" />
          <Input label={ui.t("project.domain")} name="domain" />
        </div>

        <Input
          label={ui.t("project.linkedRightsContracts")}
          name="linkedRightsContractIds"
          placeholder="contract-id-1, contract-id-2"
        />
        <p className="muted-text">{ui.t("project.linkedRightsContractsHelp")}</p>
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("project.publicationType")}</p>
            <h2>{ui.t("project.publicationTypeHelp")}</h2>
          </div>
          <Badge tone="warning">{ui.t("badge.required")}</Badge>
        </div>

        <Select
          label={ui.t("project.publicationType")}
          name="publicationType"
          onChange={(event) => setPublicationType(event.target.value as ProjectPublicationType)}
          options={publicationTypeOptions}
          required
          value={publicationType}
        />
      </section>

      <section className="content-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">{ui.t("project.projectCapabilities")}</p>
            <h2>{ui.t("project.projectCapabilitiesHelp")}</h2>
          </div>
          <Badge tone="info">{ui.t("badge.guided")}</Badge>
        </div>

        <div className="manuscript-form-grid">
          {capabilityValues.map((capability) => {
            const disabled = capability === "FLIPBOOK" && !flipbookAvailable;

            return (
              <label className="rights-checkbox" key={capability}>
                <input
                  disabled={disabled}
                  name="capabilities"
                  type="checkbox"
                  value={capability}
                />
                <span>{labelForProjectCapability(capability, ui.t)}</span>
              </label>
            );
          })}
        </div>
        {!flipbookAvailable ? (
          <p className="muted-text">{ui.t("project.flipbookMagazineOnly")}</p>
        ) : null}
      </section>

      <div className="form-actions">
        <Button type="submit">{ui.t("action.createProject")}</Button>
      </div>
    </form>
  );
}

function labelForProjectOrigin(
  value: ProjectOrigin,
  t: ReturnType<typeof createUiTranslator>["t"]
): string {
  const labels: Record<ProjectOrigin, UiTranslationKey> = {
    AUDIO_VIDEO_PROJECT: "project.audioVideoProject",
    CHILDRENS_BOOK: "project.childrenBook",
    EDITORIAL_COLLABORATION: "project.editorialCollaboration",
    EXTERNAL_AUTHOR: "project.externalAuthor",
    MAGAZINE_ARTICLE: "project.magazineArticle",
    ORIGINAL_CREATION: "project.originalCreation",
    PUBLIC_DOMAIN_CLASSICAL_WORK: "project.publicDomainClassicalWork",
    TRANSLATION: "project.translation"
  };

  return t(labels[value]);
}

function labelForPublicationType(
  value: ProjectPublicationType,
  t: ReturnType<typeof createUiTranslator>["t"]
): string {
  const labels: Record<ProjectPublicationType, UiTranslationKey> = {
    AUDIOBOOK: "project.publicationAudiobook",
    BOOK: "project.publicationBook",
    CHILDRENS_BOOK: "project.publicationChildrensBook",
    COURSE: "project.publicationCourse",
    DICTIONARY: "project.publicationDictionary",
    MAGAZINE: "project.publicationMagazine",
    POETRY: "project.publicationPoetry",
    VIDEO: "project.publicationVideo"
  };

  return t(labels[value]);
}

function labelForProjectCapability(
  value: ProjectCapability,
  t: ReturnType<typeof createUiTranslator>["t"]
): string {
  const labels: Record<ProjectCapability, UiTranslationKey> = {
    ACCESSIBILITY: "project.capabilityAccessibility",
    AUDIOBOOK: "project.capabilityAudiobook",
    FLIPBOOK: "project.capabilityFlipbook",
    ILLUSTRATIONS: "project.capabilityIllustrations",
    TRANSLATION: "project.capabilityTranslation",
    VIDEO: "project.capabilityVideo"
  };

  return t(labels[value]);
}

function labelForRightsStatus(
  value: ProjectRightsStatus,
  t: ReturnType<typeof createUiTranslator>["t"]
): string {
  const labels: Record<ProjectRightsStatus, UiTranslationKey> = {
    CLASSICAL_WORK: "project.classicalWork",
    OPEN_LICENSE: "project.openLicense",
    ORIGINAL_CREATION: "project.originalCreation",
    PUBLIC_DOMAIN: "project.publicDomain",
    RESTRICTED_PUBLICATION: "project.restrictedPublication",
    RIGHTS_OBTAINED: "project.rightsObtained",
    RIGHTS_PENDING: "project.rightsPending"
  };

  return t(labels[value]);
}
