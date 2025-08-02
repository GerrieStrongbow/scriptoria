# CamScanner

A React Native document scanner app for Android that captures documents, applies edge detection and perspective correction, and saves them as PDFs.

## Features

- Camera-based document scanning
- Automatic edge detection
- Perspective correction
- Image enhancement for professional-looking scans
- PDF generation and saving
- Document sharing functionality
- Ad-free experience

## Setup

1. Install dependencies:
```bash
npm install
```

2. For iOS (if needed):
```bash
cd ios && pod install
```

3. Run the app:
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

## Testing & Debugging

### Quick Start
```bash
# Run the automated test script
./scripts/test-app.sh
```

### Manual Testing

1. **Start Metro Bundler**:
```bash
npx react-native start
```

2. **Run on Emulator**:
```bash
# Start emulator
./scripts/start-emulator.sh

# Install and run app
npx react-native run-android --deviceId emulator-5554
```

3. **Run on Physical Device**:
```bash
# List connected devices
adb devices

# Run on specific device
npx react-native run-android --deviceId YOUR_DEVICE_ID
```

### Debugging Tools

1. **View Console Logs**:
```bash
# Interactive log viewer
./scripts/view-logs.sh

# Or manually
npx react-native log-android
```

2. **Debug Menu**:
- Shake device or press Cmd+M (emulator)
- Enable "Debug JS Remotely" for Chrome DevTools
- Enable "Fast Refresh" for live reload

3. **Flipper** (Advanced):
```bash
# Install if needed
brew install --cask flipper

# Trust the app on macOS
xattr -d com.apple.quarantine /Applications/Flipper.app

# Or right-click Flipper.app > Open
```

### Common Issues

**App not showing on emulator**:
- Make sure Metro bundler is running
- Check if app is installed: `adb shell pm list packages | grep camscanner`
- Reinstall: `npx react-native run-android --deviceId emulator-5554`

**Share button error**:
- Check logs with `./scripts/view-logs.sh`
- Debug info is logged when sharing is attempted

## Project Structure

```
CamScanner/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js      # Document list
│   │   ├── ScanScreen.js      # Camera scanning
│   │   └── DocumentScreen.js  # Document viewer
│   └── navigation/
│       └── AppNavigator.js    # Navigation setup
├── scripts/                   # Helper scripts
│   ├── start-emulator.sh     # Launch Android emulator
│   ├── test-app.sh           # Automated testing
│   ├── view-logs.sh          # Log viewer
│   └── debug-setup.sh        # Debug info
└── android/                   # Android project files
```

## Development Stack

- **Framework**: React Native 0.80.2 (Legacy Architecture)
- **Document Scanning**: react-native-document-scanner-plugin
- **PDF Generation**: react-native-pdf
- **File System**: react-native-fs
- **Sharing**: react-native-share

## Architecture Decisions

This project uses React Native's **Legacy Architecture** (not the New Architecture). This decision was made based on:

- **Stability**: Legacy Architecture is battle-tested and stable for production
- **Library Compatibility**: 100% compatibility with all our dependencies
- **Development Speed**: No time spent fighting framework issues
- **Future Migration**: Can upgrade to New Architecture when ecosystem matures (mid-2025)

See [NEW_ARCHITECTURE_MIGRATION.md](NEW_ARCHITECTURE_MIGRATION.md) for detailed migration planning.

## Troubleshooting

If you're having issues, see the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## Learn More

- [React Native Website](https://reactnative.dev)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Native GitHub](https://github.com/facebook/react-native)