# Scriptoria

A warm, scholarly document-scanning app built with React Native. The application lives in the `Scriptoria/` directory.

## Repository layout

```
Scriptoria/           # React Native app (Android + iOS)
├── src/              # Source code
├── android/          # Android-specific files
├── ios/              # iOS-specific files (future)
├── scripts/          # Build and development scripts
└── assets/           # Fonts and static assets
```

We intentionally keep the app inside `Scriptoria/` to avoid breaking native tooling and to keep a clean root. All build commands should be run from the `Scriptoria/` directory.

## Quick start

```bash
cd Scriptoria
npm install
# Android
npx react-native run-android
# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## Fonts

Custom fonts (Playfair Display, Lora, Inter) are in `Scriptoria/assets/fonts/` and linked via `react-native-asset`.

```bash
cd Scriptoria
npx react-native-asset
```

## Android/iOS names

- Android rootProject: `Scriptoria` (see `Scriptoria/android/settings.gradle`)
- iOS display name: `Scriptoria` (internal iOS project still uses CamScanner directory structure)

## Linting & formatting

```bash
cd Scriptoria
npm run lint
```

## Contributing

- Open PRs against `master`.
- Keep UI changes aligned with Scriptoria’s design language (`src/styles/scriptoriaTheme.js`).

## License

Proprietary – Do not distribute.
