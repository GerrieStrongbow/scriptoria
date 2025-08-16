# Scriptoria

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://play.google.com/store/apps/details?id=com.scriptoria.app)

**Scriptoria** is a free, ad-free document scanner app for Android that prioritizes your privacy. Transform physical documents into digital PDFs with automatic edge detection, perspective correction, and elegant organization.

## 🌟 Features

- **📷 Smart Document Scanning**: Use your camera to capture documents with automatic edge detection
- **🔧 Perspective Correction**: Automatically straightens and crops scanned documents
- **📄 PDF Generation**: Convert scanned images to searchable PDF files
- **📁 Organization**: Rename and organize your documents with custom names
- **📤 Easy Sharing**: Share documents directly from the app using Android's native sharing
- **🔒 Privacy-First**: No data collection, no ads, completely offline operation
- **✨ Clean Interface**: Intuitive design inspired by medieval manuscript aesthetics

## 🔒 Privacy & Security

Scriptoria operates **completely offline** on your device:

- ✅ **No data collection** - We don't collect any personal information
- ✅ **No internet required** - All processing happens locally on your device
- ✅ **No ads or tracking** - Clean, distraction-free experience
- ✅ **Your documents stay yours** - Files are stored only on your device
- ✅ **Open source** - Full transparency in our code

View our complete [Privacy Policy](./docs/privacy-policy.html)

## 📱 Download

<a href='https://play.google.com/store/apps/details?id=com.scriptoria.app'>
  <img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' width='200'/>
</a>

*Available exclusively on Google Play Store for Android devices.*

## 🛠️ Development

This app is built with React Native and follows modern development practices.

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio with Android SDK
- JDK 11 or higher

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/GerrieStrongbow/scriptoria.git
   cd scriptoria
   ```

2. **Install dependencies**

   ```bash
   cd Scriptoria
   npm install
   ```

3. **Android Setup**

   ```bash
   # Install Android dependencies
   cd android
   ./gradlew clean
   cd ..

   # Start Metro bundler
   npm start

   # Run on Android (in another terminal)
   npm run android
   ```

### Project Structure

```
scriptoria/
├── Scriptoria/          # React Native app source
│   ├── src/            # TypeScript source code
│   └── android/        # Android-specific code
├── publication/        # App store assets
│   ├── icons/         # App icons and store graphics
│   └── screenshots/   # App screenshots
├── docs/              # Documentation
└── README.md
```

### Key Technologies

- **React Native** - Mobile development framework
- **TypeScript** - Type-safe JavaScript
- **React Native Document Scanner Plugin** - Camera-based document scanning
- **React Native PDF** - PDF generation and viewing
- **React Native Vector Icons** - Beautiful iconography

## 🤝 Contributing

We welcome contributions! Whether it's:

- 🐛 **Bug reports** - Help us identify and fix issues
- 💡 **Feature requests** - Suggest new functionality
- 🔧 **Code contributions** - Submit pull requests
- 🌍 **Translations** - Help make Scriptoria available in more languages
- 📖 **Documentation** - Improve our guides and docs

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Native Community** - For the excellent development framework
- **Document Scanner Plugin Contributors** - For the core scanning functionality
- **Medieval Manuscript Tradition** - For the design inspiration

## 📞 Support

- **Issues**: Create an issue on GitHub for bug reports or feature requests
- **Google Play**: Leave feedback on the Google Play Store
- **Privacy Policy**: View our complete [privacy policy](./docs/privacy-policy.html)

---

**Scriptoria** - *Your personal document scanner and organizer*

Made with ❤️ for privacy-conscious users who value simplicity and elegance.
