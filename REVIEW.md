# Natasha Collins — editorial house and The Private List

Implementation is ready for code review. Release approval remains blocked on browser-level desktop/mobile QA and authenticated end-to-end verification. The upgrade is being pushed to a review branch. Production deployment has not been approved.

## Product changes

- Founder-led editorial homepage, paced founder story, warm paper/ink design system, mobile navigation and invitation-led footer.
- Redesigned ORA edit, custom jewellery, founder coaching and studio pages. Existing catalogue and Shopify product destinations retained. Removed unsupported sales/press claims and stale shipping/price promises.
- Charm atelier with illustrative metallic composition, settling animation, categories, selection limits, keyboard-operable order controls, named device-local stacks and explicit Shopify handoff. Composition is not transferred to Shopify; the interface says so.
- The Private List supports signed-out, explicit application, pending, active and paused states. Offers, early releases and premiere events come from the database. Empty states make no invented event or benefit promises.
- Owner desk supports approvals, pause/restore, draft/edit/publish/expire/archive, availability, schedule, event information and reservation links. Entries may target all active members or a single member. Optional starter content is explicitly labelled.

## Security and setup

The old email-match administrator promotion has been removed. Configure **NATASHA_OWNER_USER_ID** server-side with Natasha's independently verified, existing Better Auth user ID. This is an app user ID, not a GitHub ID. A stored legacy admin role or matching email is insufficient. Owner mutations require the pinned ID and an active membership. The initial membership request creates an active owner profile only when the authenticated ID matches that configuration; an existing pending/paused owner profile requires a trusted operator to reconcile its status before release.

- Existing Better Auth session middleware and same-site checks remain in place. Private functions additionally require a real session; the shared development user cannot gain access.
- Private responses are marked `private, no-store` after session resolution. GET reads do not submit membership applications.
- SQL queries scope personal entries to the authenticated user. Pending/paused/unregistered members receive no entries or owner queue data.
- Shared and personal discount codes are entered by Natasha, not generated or provisioned on Shopify. Codes must already be valid on Shopify. Expired/unavailable entries do not return codes to members.
- Every mutation has strict Zod validation, parameterized SQL and owner authorization. Event links must be HTTPS; offer/release links must remain on ORA. Content is rendered as text.
- Atomic audit records omit discount codes; optimistic version checks reject stale concurrent edits.

Migration `0003_private_list.sql` is additive. Existing accounts, memberships and products are retained. Rollback instructions are in the migration; back up new content first. No production database was contacted.

The production build now copies PGlite's WASM/data companions beside the Nitro bundle, fixing a runtime failure when previewing without PostgreSQL. Real deployments must use durable PostgreSQL; embedded preview data remains in-memory. Deployment configuration, platform middleware, auth providers, Stripe coaching link and Shopify checkout remain intact.

## Verification

| Check                                            | Result                                                                                            |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Production build                                 | Passed                                                                                            |
| TypeScript                                       | Passed                                                                                            |
| ESLint                                           | Passed; fixed an existing empty catch and stale lint directive                                    |
| Private List SQL integration suite               | 12 passed, 0 failed                                                                               |
| Existing auth/app-data TypeScript suites         | 55 passed, 0 failed                                                                               |
| Full script test suite                           | 194 passed, 13 failed                                                                             |
| Original baseline script suite, same app flags   | 182 passed, same 13 failures                                                                      |
| Built Vercel handler SSR                         | All 8 routes returned 200 and main content; signed-out member response has no queue or test codes |
| Brand asset checks                               | Passed, zero warnings                                                                             |
| Browser desktop/mobile interaction and visual QA | BLOCKED, not passed                                                                               |

The 13 existing script failures concern missing `.grok/skills/og` documentation, missing ignored platform icon assets and platform branding tests that assume a generic template. They also fail against the unchanged original source. The new migration was added to the migration-order expectation. Existing failures were not skipped or hidden.

Browser constraints: the cloud browser rejects local app and file URLs. The local Playwright executable is absent, and its official download timed out. No alternative browser path was used after the explicit policy rejection. The default all-interface Vite listener also encounters an environment network-interface error. No authentication was weakened to obtain a preview.

`artifacts/design-review/` contains static SSR snapshots of the public routes with generated CSS and existing media. These are review material, not a running app; forms, authentication and filters are inactive. They have not been visually verified. `artifacts/natasha-upgrade.patch` contains the full source diff, including new files and the binary share card.

## Content to confirm next

- A real founder portrait and approved jewellery/bench photography; existing assets were retained and their provenance has not been independently verified.
- Approval of the newly drafted first-person copy and the retained biographical details.
- Actual offers, Shopify-configured codes, terms and eligibility, plus genuine event dates, venues and reservation URLs.
- Coaching availability, session arrangements and booking/payment follow-up; the existing £75/one-hour offer and Stripe destination were retained.
- Current studio contact/address details, and the verified owner account ID for server configuration.

## Before release

Complete live desktop/mobile visual and interaction QA, authenticated owner/member flows and forged-request tests in a suitable environment, restore required platform assets/documentation, and verify the intended deployment's auth/DB configuration. Review the diff and obtain Natasha's explicit approval before any push or deployment.
