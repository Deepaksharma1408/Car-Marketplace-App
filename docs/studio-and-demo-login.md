# VehicleSpot Studio and local demo sessions

## Implemented flows

- Discover has one video feed. The Reels / For Sale / All Feed header tabs were removed; Car Listings remains the destination for sale listings.
- Seller identities use `router.navigate`, and their self-link/chevron is disabled on that seller's own profile. Contact/profile navigation no longer grows repeated copies of the same seller screen.
- Create offers finished video, raw clips with a template, photo-only listings and social vehicle videos. Each path has media, details, presentation/template and review steps, saved drafts and local publishing.
- Photos remain manually selected static galleries. Finished videos remain intact. Raw clips play sequentially with one of three overlay styles; this does not encode/export a combined MP4 or implement AI editing/audio processing.
- Media is selected with the native system picker, copied into app documents, validated before publishing, and retained for local posts. Videos are limited to 60 seconds total, 720p/1080p and 100 MB per file. Raw sequences require 3–6 clips; photo galleries accept 1–12 photos. Videos require a cover photo.
- Published posts appear in Profile and the applicable Discover/Car Listings screens, details, saved collections and seller profiles.

## Demo login

The user explicitly selected local demo login/logout. The app stores a name/email session on this device, restores it on launch, and removes it on logout. No password, identity verification or server authentication is provided. Creation requires a demo session. Public demo posts, saved/liked cars and appearance preferences are not erased by logout.

Storage keys: `@vehiclespot_demo_session`, `@vehiclespot_local_posts`, and per-user/path `@vehiclespot_draft:<userId>:<mode>`. Existing storage keys are preserved.

## Validation

- `node --experimental-strip-types --test tests/creation.test.mjs`: five passing tests for media counts/types, clip duration, resolution/size limits, unreadable metadata, price/mileage rules and meaningful car details.
- TypeScript and ESLint passed.
- Android development preview: demo login/gating; native photo picking with project-owned fixtures; draft and session restoration after restart; all four steps of the photo listing flow; manual gallery review; successful local publication and visibility in Profile; logout.
- Android release version 1.1.0 (version code 2) built successfully; signature and ZIP integrity passed. It installed and cold-launched successfully without Metro. The installed APK showed Discover without filter tabs and seller profiles without a self-link arrow. The native image-picker class was confirmed in the APK.
- Physical phones and iOS were not available for testing. Actual device-codec compatibility and full video-export pipelines are outside this local prototype.

Metro excludes local SDK, AVD and Gradle cache folders to prevent Windows socket-file watcher crashes.
