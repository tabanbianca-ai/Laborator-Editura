# Channel Registry

Every distribution channel is represented by a canonical channel registry
record.

Channel types:

- OWN_PUBLIC_LIBRARY
- OWN_STORE
- EXTERNAL_STORE
- PRINT_ON_DEMAND
- AUDIO_PLATFORM
- VIDEO_PLATFORM
- INSTITUTIONAL
- DIRECT_DOWNLOAD

Provider behavior belongs behind channel adapters. Provider-specific logic must
not enter editorial domain logic.

