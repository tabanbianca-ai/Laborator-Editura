# Regeneration Policy

Regeneration is controlled by dependency fingerprints.

If any source dependency changes, the existing build becomes OUTDATED:

- master document version
- metadata version
- rights record
- publication profile
- layout profile
- typography profile
- source checksum

An OUTDATED build is not edited. A new build and package are generated.

