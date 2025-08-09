# Scriptoria Release Checklist

## Pre-Release Setup ✅

### 1. App Configuration
- [x] App name: "Scriptoria"
- [x] Package ID: "com.scriptoria"
- [x] Version set to 1.0.0
- [x] Build.gradle configured for release signing

### 2. Code Signing
- [ ] Generate release keystore: `./scripts/generate-keystore.sh`
- [ ] Create `android/keystore.properties` with your keystore credentials
- [ ] Keep keystore file and passwords safe (backup separately)

### 3. App Icons
- [ ] Create or generate app icon: `./scripts/create-placeholder-icon.sh`
- [ ] Generate all icon sizes: `./scripts/generate-app-icons.sh`
- [ ] Review generated icons for quality

### 4. Build Release
- [ ] Build release APK/AAB: `./scripts/build-release.sh`
- [ ] Test APK on physical device
- [ ] Verify all features work correctly

## Google Play Store Requirements

### Store Listing Assets
- [ ] App icon: 512x512 PNG
- [ ] Feature graphic: 1024x500 PNG
- [ ] Screenshots: At least 2 (up to 8) for phone
  - Recommended: 1080x1920 or 1080x2400
  - Show key features: Scanning, PDF generation, sharing
- [ ] Short description (80 characters max)
- [ ] Full description (4000 characters max)

### Content Requirements
- [ ] Privacy Policy URL (required for camera permission)
- [ ] App category: Productivity or Tools
- [ ] Content rating questionnaire
- [ ] Target audience and content
- [ ] Contact email

### Technical Requirements
- [ ] Minimum SDK: 23 (Android 6.0)
- [ ] Target SDK: Current (check build.gradle)
- [ ] Supported devices: Phones and tablets
- [ ] Languages: English (add more as needed)

## Sample Store Listing Content

### Short Description
"Scan documents to PDF with your phone. Ad-free, simple, and secure."

### Full Description
```
Scriptoria - Simple Document Scanner

Transform your phone into a powerful document scanner. Scriptoria makes it easy to scan, save, and share documents as high-quality PDFs or images.

KEY FEATURES:
✓ Automatic edge detection
✓ Perspective correction
✓ Image enhancement for clear, readable scans
✓ Save as PDF or JPG
✓ Share instantly via any app
✓ Rename and organize your scans
✓ Completely ad-free experience
✓ No watermarks or limitations

PERFECT FOR:
• Students scanning notes and assignments
• Professionals digitizing receipts and documents
• Anyone needing quick document copies
• Creating PDF files from physical documents

SIMPLE TO USE:
1. Point your camera at a document
2. DocuSnap automatically detects edges
3. Review and adjust if needed
4. Save or share your scan

PRIVACY FIRST:
• No account required
• Documents stay on your device
• No cloud uploads
• Camera permission used only for scanning

Scriptoria is the document scanner that respects your privacy and time. No ads, no nonsense - just simple, effective document scanning.
```

## Privacy Policy Template

Create a simple privacy policy covering:
- App doesn't collect personal data
- Camera permission used only for scanning
- Documents stored locally on device
- No data transmission to servers
- No analytics or tracking

Host on GitHub Pages or similar free service.

## Release Process

1. **Prepare Release Build**
   ```bash
   ./scripts/generate-keystore.sh  # First time only
   ./scripts/build-release.sh
   ```

2. **Test Release Build**
   - Install APK on physical device
   - Test all features thoroughly
   - Check permissions requests

3. **Create Google Play Developer Account**
   - One-time fee: $25
   - Verify identity
   - Set up payment profile

4. **Create App in Play Console**
   - Choose app name
   - Select default language
   - Specify app/game type
   - Specify free/paid

5. **Upload Release**
   - Upload AAB file
   - Complete store listing
   - Set up content rating
   - Configure pricing & distribution

6. **Submit for Review**
   - Review time: Usually 2-3 hours
   - May take up to 24 hours
   - Fix any policy violations

## Post-Release

- Monitor crash reports
- Respond to user reviews
- Plan feature updates
- Regular maintenance releases

## Important Notes

- **Never lose your keystore file!** You'll need it for all future updates
- Test on multiple devices before release
- Consider testing tracks first (see TESTING_GUIDE.md)
- Keep version codes incrementing for each release
- Follow Google Play policies strictly
