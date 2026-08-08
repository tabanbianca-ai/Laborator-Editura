# Editor Accessibility

The editorial and translation editor surfaces must remain keyboard and screen-reader usable.

## Requirements

- keyboard navigation;
- visible focus;
- accessible labels;
- segment navigation without mouse-only behavior;
- status announcements;
- readable contrast;
- synchronized source/target navigation without inaccessible coupling;
- no content language changes caused by Platform Language.

## Existing Evidence

- The web editor uses reusable UI components and server actions.
- Translation editor surfaces include source panel, target textarea, segment list, toolbar, save status,
  workflow status, and right panel evidence tabs.
- UI text must come from localization resources for Romanian, English, Spanish, French, Portuguese,
  Italian, and German.

## Remaining Gap

A browser-based accessibility audit is recommended before RC1. Batch 04 adds contract coverage and keeps
the accessibility requirements documented.
