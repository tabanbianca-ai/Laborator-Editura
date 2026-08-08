# Digital Assets

Digital assets are files or resources associated with Works and Editions. A file is not the Work.

Canonical fields:

- `asset_id`
- `organization_id`
- `work_id`
- `edition_id`
- `asset_type`
- `mime_type`
- `language`
- `source_asset_id`
- `source_version`
- `storage_reference`
- `checksum`
- `size`
- `status`
- `rights_record_id`
- `accessibility_metadata`
- `integrity_status`
- `created_at`

Asset types:

- `SOURCE_FILE`
- `IMAGE`
- `ILLUSTRATION`
- `COVER`
- `PDF`
- `EPUB`
- `AUDIO`
- `VIDEO`
- `SUBTITLE`
- `TRANSCRIPT`
- `THUMBNAIL`
- `MARKETING_ASSET`
- `OTHER`

Integrity states:

- `VALID`
- `MISSING`
- `CORRUPTED`
- `UNVERIFIED`
- `SUPERSEDED`
- `ARCHIVED`

Rules:

- Derived assets keep exact Work, Edition, source asset, and source version references.
- Checksum, size, MIME type, storage status, and source version are integrity inputs.
- Unauthorized file changes must be detectable through integrity evaluation.
