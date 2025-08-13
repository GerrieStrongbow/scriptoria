# Publishing Scriptoria to Google Play Store

This guide will walk you through the complete process of publishing your React Native app to the Google Play Store.

## Prerequisites Checklist

Before starting, ensure you have:

- [x] Production-ready app (Scriptoria is ready!)
- [x] Google Play Console Developer Account ($25 one-time fee)
- [x] App signing key and keystore file
- [x] App icons in all required sizes
- [ ] Screenshots for store listing
- [ ] App description and metadata
- [ ] Privacy Policy (required for apps that handle user data)

## Step 1: Create Google Play Console Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Sign in with your Google account
3. Pay the $25 one-time developer registration fee
4. Complete the developer profile (name, address, etc.)
5. Verify your identity (may take 1-3 days)

## Step 2: Generate a Signed APK/Bundle

### 2.1 Generate Signing Key

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore scriptoria-release-key.keystore -alias scriptoria-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Store the keystore file and passwords securely! You'll need them for all future updates.

### 2.2 Configure Gradle for Signing

Edit `android/gradle.properties`:

```properties
SCRIPTORIA_UPLOAD_STORE_FILE=scriptoria-release-key.keystore
SCRIPTORIA_UPLOAD_KEY_ALIAS=scriptoria-key-alias
SCRIPTORIA_UPLOAD_STORE_PASSWORD=your_keystore_password
SCRIPTORIA_UPLOAD_KEY_PASSWORD=your_key_password
```

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('SCRIPTORIA_UPLOAD_STORE_FILE')) {
                storeFile file(SCRIPTORIA_UPLOAD_STORE_FILE)
                storePassword SCRIPTORIA_UPLOAD_STORE_PASSWORD
                keyAlias SCRIPTORIA_UPLOAD_KEY_ALIAS
                keyPassword SCRIPTORIA_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

### 2.3 Build Release Bundle

```bash
cd android
./gradlew bundleRelease
```

The AAB file will be at: `android/app/build/outputs/bundle/release/app-release.aab`

## Step 3: Prepare App Assets

### 3.1 App Icons

Create app icons in these sizes (place in `android/app/src/main/res/`):

- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

### 3.2 Feature Graphic

- Create a 1024x500 pixel feature graphic for the store listing
- Should showcase your app's key features
- Must be high-quality and professional

### 3.3 Screenshots

Take screenshots of your app running on different devices:

- At least 2 screenshots required
- Recommended: 4-8 screenshots showing key features
- Phone screenshots: minimum 320px, maximum 3840px
- 16:9 or 9:16 aspect ratio recommended

## Step 4: Create App Listing

### 4.1 Basic Information

- **App Name:** Scriptoria
- **Short Description:** (80 characters) "Professional document scanning with medieval manuscript aesthetics"
- **Full Description:** (4000 characters max)

```
Transform your documents into beautifully preserved digital manuscripts with Scriptoria.

KEY FEATURES:
📜 Professional Document Scanning
• High-quality document capture with automatic edge detection
• Intelligent cropping and enhancement
• Support for multiple document types

🎨 Medieval Manuscript Aesthetics
• Elegant parchment-inspired interface
• Sophisticated serif typography
• Warm, scholarly color palette

📚 Organized Digital Library
• Intuitive manuscript organization
• Smart search functionality
• Easy renaming and management
• Chronological document sorting

✨ Refined User Experience
• Minimalist, distraction-free design
• Smooth, responsive navigation
• Professional-grade scanning results

Perfect for students, researchers, professionals, and anyone who values both functionality and beautiful design. Scriptoria combines cutting-edge scanning technology with the timeless elegance of medieval manuscripts.

Download now and transform your document workflow into an art form.
```

### 4.2 Categorization

- **Category:** Productivity
- **Content Rating:** Everyone
- **Tags:** document scanner, productivity, manuscripts, PDF, scanning

### 4.3 Contact Details

- **Website:** (if you have one)
- **Email:** Your support email
- **Privacy Policy:** Required - create a simple privacy policy

## Step 5: Privacy Policy

Create a simple privacy policy and host it (you can use GitHub Pages):

```markdown
# Privacy Policy for Scriptoria

Last updated: [Date]

## Information We Collect
Scriptoria processes documents locally on your device. We do not collect, store, or transmit any personal information or document content to external servers.

## Local Storage
- Documents are stored locally on your device
- App preferences are stored locally
- No data is shared with third parties

## Permissions
- Camera: Required for document scanning
- Storage: Required to save scanned documents

## Contact
For questions about this privacy policy, contact: [your-email]
```

## Step 6: Upload and Submit

### 6.1 Create New App

1. In Google Play Console, click "Create app"
2. Fill in app details:
   - App name: Scriptoria
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
   - Declarations: Complete the content policy and US export laws sections

### 6.2 Upload AAB File

1. Go to "App releases" → "Production"
2. Click "Create new release"
3. Upload your `app-release.aab` file
4. Fill in release notes:

```
Initial release of Scriptoria - Professional document scanning with medieval manuscript aesthetics.

Features:
• High-quality document scanning with automatic enhancement
• Beautiful parchment-inspired interface design
• Organized digital manuscript library
• Smart search and organization tools
• Elegant serif typography and warm color palette

Transform your document workflow into an art form with Scriptoria.
```

### 6.3 Complete Store Listing

1. Upload all graphics (icon, feature graphic, screenshots)
2. Fill in app description
3. Set content rating (likely "Everyone")
4. Select app category and tags
5. Add privacy policy URL

### 6.4 Content Rating

Complete the content rating questionnaire - Scriptoria should receive an "Everyone" rating since it's a productivity app with no sensitive content.

### 6.5 App Content

- Privacy Policy: Link to your hosted privacy policy
- Ads: Select "No, my app does not contain ads"
- Target audience: "General audience"

## Step 7: Review and Publish

### 7.1 Pre-Launch Testing (Optional but Recommended)

- Enable pre-launch reports to test on real devices
- Google will test your app automatically and provide feedback

### 7.2 Submit for Review

1. Review all sections in the Play Console dashboard
2. Ensure all required fields are completed (green checkmarks)
3. Click "Submit for review"

### 7.3 Review Process

- First-time apps: Can take 1-3 days for review
- Updates: Usually reviewed within a few hours
- You'll receive email notifications about review status

## Step 8: Post-Publication

### 8.1 Monitor Performance

- Check app statistics in Play Console
- Respond to user reviews
- Monitor crash reports and ANRs

### 8.2 Future Updates

- Increment version codes in `build.gradle`
- Upload new AAB files to Play Console
- Write clear release notes for each update

## Troubleshooting Common Issues

### Build Issues

- **Gradle build fails:** Check that all dependencies are properly installed
- **Signing issues:** Verify keystore path and passwords are correct
- **Bundle size too large:** Consider code splitting or asset optimization

### Review Rejections

- **Policy violations:** Ensure your app complies with Google Play policies
- **Technical issues:** Fix any crashes or performance problems
- **Metadata issues:** Ensure descriptions and screenshots accurately represent your app

## Important Notes

1. **Keep your keystore safe:** Store it securely and back it up. If you lose it, you cannot update your app.

2. **Version management:** Always increment your version code for each release:

   ```gradle
   android {
       defaultConfig {
           versionCode 2  // Increment this for each release
           versionName "1.0.1"  // Update for user-facing version
       }
   }
   ```

3. **Testing:** Test your release build thoroughly before submission.

4. **App Bundle vs APK:** Google Play prefers App Bundles (AAB) over APKs for better optimization.

## Support Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Android App Bundle Documentation](https://developer.android.com/guide/app-bundle)
- [React Native Release Build Guide](https://reactnative.dev/docs/signed-apk-android)

---

Good luck with your app launch! 🚀
