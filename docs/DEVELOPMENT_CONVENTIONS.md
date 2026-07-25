# Development Conventions

Version: 1.0.

## Purpose

These conventions are the official development standards for Laborator
Editura. They apply to all current and future implementation work, all software
components, all modules, and all AI-assisted development tools used on the
project.

These conventions may be changed only by an explicit decision from the project
owner.

## Development Language

The internal project implementation must be developed exclusively in English.

This applies to:

- Source code.
- Project structure.
- Directories.
- Files.
- Classes.
- Functions.
- Methods.
- Variables.
- Constants.
- APIs.
- Database objects.
- Table names.
- Column names.
- Models.
- Migrations.
- Technical documentation.
- Automated tests.
- Technical comments.

Other languages must not be used for internal implementation identifiers,
technical comments, test names, API names, database names, or technical
documentation.

## User Interface Localization

The user interface must use the localization system exclusively.

The UI must not contain:

- Directly written user-facing text in components.
- Hardcoded labels.
- Fixed component display names.
- Mixed-language messages.

All user-facing text must be loaded from translation dictionaries or the
approved localization system.

## Platform Languages

The platform must be designed to support all languages.

The first official UI localization set is:

- Romanian, as the primary platform language.
- English.
- Spanish.
- French.
- Portuguese.
- Italian.
- German.

The architecture must allow additional platform languages to be added later
without changing the application architecture.

## Active Language Rule

The full user interface must be displayed in the selected platform language.

Language mixing is not allowed. Menus, labels, buttons, notifications,
messages, dialogs, workflow names, and module names must use the active
platform language.

Examples:

- If Romanian is selected, the entire interface must be in Romanian.
- If Spanish is selected, the entire interface must be in Spanish.
- If French is selected, the entire interface must be in French.

The same rule applies to every supported platform language.

## User Interface Terminology

The platform must prioritize established standard interface terminology for
each supported language.

Terminology priority:

1. International localization standards:
   - Unicode CLDR.
   - ICU.
   - The approved i18n systems used by the application.
2. Official operating-system translations:
   - Microsoft Windows.
   - Apple macOS.

General interface terms must use the already established translations from
these standards and operating systems. The platform must not reinvent standard
translations for common UI concepts such as save, cancel, delete, edit,
settings, profile, user, password, search, confirmation, and help.

Each platform language must use its own official terminology. Romanian UI must
not display terms from other languages. The same rule applies to all supported
languages.

Editorial content language, original manuscript language, authoring language,
and translation target language remain separate from platform UI language.

## Platform Terminology Dictionary

The platform may maintain its own terminology dictionary only for terms that
are specific to Laborator Editura.

The dictionary is limited to:

- Editorial terms.
- Doctrinal terms.
- Official module names.
- Platform-specific concepts.

Examples include the application name, Library, Workspace, Magazine,
Translation, Children's Books, Narrator, Intelligent Principle, Spirit, and
Perispirit, plus other terms that are not defined by international localization
standards.

## Terminology Rule

Every new user-facing term must follow this process:

1. Check whether the term exists in international localization standards or
   established operating-system terminology.
2. If it exists, use the official established translation.
3. If it does not exist, add the term to the platform terminology dictionary
   and treat it as an official platform term.

Different variants for the same official term are not allowed unless the
project owner explicitly approves a terminology change.

## Architecture Separation

The separation between internal implementation and user interface language is
mandatory:

- Internal implementation: English.
- User interface: fully localized.

This rule applies to every module and every future extension.

## Authentication

The platform must use a single authentication system for:

- `laboratoreditorial.com`.
- `app.laboratoreditorial.com`.
- `api.laboratoreditorial.com`.

The platform must use:

- One user base.
- One session model.
- One role system.
- One permission system.

## Roles

Official operational roles are:

- Administrator.
- Editor.
- Translator.
- Proofreader.
- Designer.
- Narrator.
- Author.
- Collaborator.
- Reader.
- Guest.

Internal role identifiers must remain in English. UI role labels must be
localized through the platform localization system.

Application access must be based only on roles and permissions.

## Application Protection

All modules must be protected by authentication and authorization.

Unauthenticated access is not permitted except for explicitly public endpoints
approved by the architecture, such as health checks or public catalog read
surfaces.

## Module Coverage

These conventions apply to all platform modules, including:

- Library.
- Translation.
- Magazine.
- Children's books.
- Audio.
- Video.
- Scheduling.
- Workspace.
- Export.
- Administration.
- Observability.
- Audit.
- All future modules.

## Extensibility

The platform must be designed for long-term development.

Adding a new language, module, role, user type, or feature must not require a
change to the existing architecture.

## General Principle

Every implementation for Laborator Editura must respect these conventions.

This document is the official development standard for future work performed by
Codex, ChatGPT, Lovable, or any other development tool.

If there is ambiguity or more than one possible implementation approach, these
official development conventions take precedence. No implementation may
contradict them without explicit project owner approval.
