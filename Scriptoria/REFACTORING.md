# Refactoring Plan

## Prioritized Changes

1. [DONE] **Adopt the existing `AppNavigator` stack**  
   Replace the manual screen switching in `App.tsx` with React Navigation so that navigation state, back handling, and deep linking work consistently across platforms. This also simplifies prop plumbing for `route` and `navigation` objects.
   _Risks: Screen transitions may break temporarily if params are not aligned; Android hardware back handling needs to be retested._

2. [DONE] **Extract a shared document file service**  
   Consolidate duplicated file system logic (load, rename, delete, share, metadata handling) from `HomeScreen` and `DocumentScreen` into a dedicated module under `src/services` or `src/utils`. Provide typed return values and error handling helpers.
   _Risks: Any mistakes in the shared service can affect every document action, so regression tests for multi-page flows are essential._

3. [DONE] **Fix the logger environment guards**  
   Update `src/utils/logger.ts` to avoid redeclaring `__DEV__`, expose structured log levels, and ensure production logging aligns with expectations.
   _Risks: Minimal, but if guarded improperly you might lose useful diagnostics in development builds._

4. [DONE] **Rationalize metadata usage for multi-page documents**  
   Either fully consume the `*.metadata.json` files (preferred) or drop them and rely solely on filename patterns. If consuming them, add migration logic for existing saves and fail-safes when metadata is missing.
   _Risks: Existing documents could become unreadable if metadata assumptions change; a migration script or fallback path is required._

5. [DONE] **Break up the monolithic screens into composable components**  
   Extract list items, modals, and generic layout pieces into smaller components to shrink the 600+ line screen files. This improves readability and reuse alongside the themed component library.
   _Risks: Prop drilling or styling regressions may appear if extracted components are not wired correctly._

6. [DONE] **Convert key screens and services to TypeScript**  
   Move the JavaScript-heavy modules to `.ts`/`.tsx`, introduce explicit types for document entities, and leverage the existing TypeScript toolchain to catch logic errors earlier.
   _Risks: Type migration may surface previously hidden issues; third-party type definitions for native modules may need augmentation._

7. [DONE] **Expand automated test coverage**  
   Add unit tests for the shared document service and component-level tests for list rendering and rename flows. Introduce integration tests (e.g., Detox or component harness) once navigation is stabilized.
   _Risks: Requires mocking native modules; flakiness can slow CI if mocks are incomplete._

8. [DONE] **Remove dead code and unused dependencies**  
   Delete unused styling modules (`StyledComponents`) and packages (`react-native-pdf`, any unreferenced libraries) after confirming they are not part of upcoming features.
   _Risks: Future planned features might rely on currently dormant code; confirm with stakeholders before removal._

9. [DONE] **Standardize error and toast feedback**  
   Replace direct `Alert` calls with a centralized feedback utility to provide consistent UX and facilitate future localization.
   _Risks: Users might temporarily lose critical error visibility if the new feedback system is not thoroughly exercised._

10. [DONE] **Document file storage contracts**  
    Capture the expected directory structure, naming conventions, and cleanup rules in developer docs to guide future contributors and prevent accidental regressions.
    _Risks: Low; ensure documentation stays in sync as refactors land._

## General Mitigations

- Perform refactors incrementally and land automated tests alongside each change.
- Keep a sample dataset of single- and multi-page documents to manually validate critical flows after each step.
- Coordinate with design/product before removing legacy components or altering UX-heavy flows.

## Upcoming Android compliance tasks

- **Edge-to-edge readiness (Android 15)**: Medium importance—Android 15 defaults to edge-to-edge, so update window inset handling to avoid clipped layouts. Estimate 1–2 days if screens already respect `WindowInsets`; risk is low–medium UI regressions, so plan preview testing.
- **Large-screen resizability/orientation (Android 16)**: Medium–high importance—Android 16 will ignore restrictive manifest flags, which can expose layout bugs on tablets, foldables, and multi-window. Effort ranges from a quick manifest audit to multi-week responsive design work; risk is medium without thorough large-screen QA.
- **16 KB native library alignment (Android 16)**: High importance if shipping `.so` files—misaligned libs will fail to load on 16 KB page-size devices. Rebuild with a modern NDK/Gradle toolchain (includes 16 KB alignment) and verify third-party binaries; effort is usually low unless waiting on vendor updates, with medium risk until everything is rebuilt.
