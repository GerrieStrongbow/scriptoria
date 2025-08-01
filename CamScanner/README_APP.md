# CamScanner - Document Scanner App

A free, ad-free document scanner app for Android that uses your phone's camera to scan documents, apply edge detection, enhance images, and save them as PDFs.

## Features

- **Automatic Edge Detection**: Automatically detects document edges and applies perspective correction
- **Image Enhancement**: Converts photos into clean, scanned-looking documents
- **Multi-Page Support**: Scan multiple pages into a single PDF
- **PDF Generation**: Saves all scanned documents as PDF files
- **Local Storage**: Saves documents to your device's internal storage
- **Document Management**: View, share, and delete scanned documents
- **No Ads**: Completely free with no advertisements
- **No Internet Required**: Works entirely offline

## Tech Stack

- React Native
- react-native-document-scanner-plugin (OpenCV-based edge detection)
- react-native-pdf-lib (PDF generation)
- react-native-fs (File system access)
- react-native-pdf (PDF viewer)

## Setup Instructions

### Prerequisites

1. Node.js (v14 or higher)
2. Java Development Kit (JDK 11)
3. Android Studio with Android SDK
4. Android device or emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS (if needed in future):
```bash
cd ios && pod install
```

### Running the App

1. Start Metro bundler:
```bash
npm start
```

2. In a new terminal, run on Android:
```bash
npm run android
```

Or if you have a physical device connected:
```bash
npx react-native run-android
```

## Building for Production

To create a release APK:

```bash
cd android
./gradlew assembleRelease
```

The APK will be available at `android/app/build/outputs/apk/release/app-release.apk`

## Usage

1. **Home Screen**: Shows all your scanned documents
   - Tap a document to view it
   - Long press to delete
   - Pull down to refresh the list

2. **Scanning**: Tap the blue "+" button to scan
   - The camera will open with edge detection
   - Align the document within the frame
   - The app will automatically detect edges
   - You can manually adjust corners if needed
   - Scan multiple pages if desired

3. **Viewing Documents**: Tap any document to view
   - Pinch to zoom
   - Swipe to navigate pages
   - Tap "Share" to send via email, WhatsApp, etc.

## File Storage

Documents are saved in the app's internal storage directory:
- Android: `Internal Storage/Android/data/com.camscanner/files/Documents/scanned_documents/`

## Troubleshooting

### Camera not working
- Make sure you've granted camera permissions
- Go to Settings > Apps > CamScanner > Permissions

### Cannot save documents
- Ensure storage permissions are granted
- Check available storage space

### Build errors
- Clean and rebuild:
```bash
cd android && ./gradlew clean
cd .. && npm run android
```

## Future Enhancements

- [ ] iOS support
- [ ] Cloud backup options
- [ ] OCR text recognition
- [ ] Custom file naming
- [ ] Batch operations
- [ ] Image filters (B&W, grayscale, color enhancement)
- [ ] Document categories/folders