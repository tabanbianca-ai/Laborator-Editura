# Video Rendering

Canonical rendering flow:

Canonical Timeline -> Asset Validation -> Audio Composition -> Caption
Composition -> Visual Rendering -> Encoding -> Validation -> Video Asset.

Every `VideoBuild` records:

- video production.
- master version.
- timeline version.
- video profile version.
- asset versions.
- renderer name and version.
- checksums.
- validation result.
- immutability.

The Publishing Engine build rules apply to multimedia rendering.

