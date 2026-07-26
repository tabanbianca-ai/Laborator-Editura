# Notification Channel Router

## Purpose

The Channel Router selects the correct delivery channels for each notification
based on event type, priority, recipient preferences, organization policy,
channel availability, and security constraints.

## Inputs

Channel routing evaluates:

- Notification type.
- Source module.
- Priority.
- Recipient user.
- Recipient role.
- User notification preferences.
- Quiet hours.
- Organization policy.
- Channel status.
- Integration status.
- Need-to-Know visibility.
- Mandatory communication rules.

## Supported Channels

Initial and future-supported channels:

- `IN_APP`.
- `EMAIL`.
- `PUSH`.
- `WEBHOOK`.
- `SMS`.
- `MICROSOFT_TEAMS`.
- `SLACK`.
- `CUSTOM_ADAPTER`.

Channel adapters must be replaceable and must not be called directly by domain
modules.

## Routing Rules

Default rules:

- In-app is the baseline authenticated channel.
- Email is used for account, approval, publication, rights, and operational
  messages when enabled by policy.
- Push is optional and preference-aware.
- Webhook is used for external system notifications and integration events.
- SMS is optional and must be reserved for critical alerts if enabled.
- Teams and Slack are future team communication adapters.

Mandatory messages may bypass optional preference disablement only when
security, compliance, rights, workflow, or account recovery policy requires
delivery.

## Preference Awareness

The router must respect:

- Channel enabled/disabled setting.
- Notification type preference.
- Quiet hours.
- Digest frequency.
- Preferred locale.

The router must record when a channel is skipped because of user preference.

## Security Rules

The router must:

- Enforce tenant scope.
- Avoid sending restricted content to external channels.
- Use authenticated links for sensitive content.
- Check Need-to-Know before including resource details.
- Avoid logging secrets or sensitive payload bodies.

## Current Repository Baseline

Current related state:

- Workspace preferences can store notification preference metadata.
- Gateway has webhook records and enablement status.
- No centralized channel router was identified.
- No email, push, SMS, Teams, or Slack adapter runtime was identified.

## Audit Requirements

Audit must record:

- Channel selection.
- Channel skipped.
- Preference applied.
- Mandatory delivery applied.
- External channel redaction applied.
- Routing failure.
