# Seller contact and marketplace preview

- Discover: Contact Seller opens `/contact/[vehicleId]`. The seller handle/avatar opens `/seller/[sellerId]`; the car title opens `/vehicle/[vehicleId]` for both sale listings and reels.
- Car Listings replaces Search in the bottom bar and displays the nine existing sample sale listings, with prices, specifications and seller identities. The header search shortcut remains available.
- Seller profiles group existing cars and reels by seller ID. Social reels retain their social classification and do not acquire sale prices.
- Contact information is explicitly sample data. The phone reveal does not place a call.
- Chat is a local prototype, not a messaging service. Messages and labelled simulated replies are persisted in AsyncStorage under `@vehiclespot_demo_chat:<sellerId>:<vehicleId>`. No seller is contacted. Live messaging requires authentication, a backend, delivery handling and seller accounts.
- Existing saved/liked and appearance storage keys are unchanged.

## Verification, 2026-10-28

TypeScript and ESLint passed. Android emulator checks covered the Contact Seller button, sample-number reveal, sending a demo question, the simulated reply, reopening the saved conversation from a seller profile, tapping @rashid_dxb on a reel, tapping its car title, and opening Car Listings with nine sample sale vehicles. These checks used the Android development preview; the standalone APK is also rebuilt for distribution. No physical device or iOS testing was available.
