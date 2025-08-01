Build a document scanner app for Android that:

1. Captures documents using the phone's camera
2. Automatically detects document edges and applies perspective correction
3. Enhances the image to make it look like a proper scanned document (not just a photo)
4. Saves as PDF to the device's internal storage
5. Is ad-free unlike existing apps on the Play Store

Recommended Tech Stack

For building this Android document scanner app, I recommend:

React Native with the following key libraries:

1. react-native-document-scanner-plugin - Provides automatic edge detection, perspective correction, and image enhancement
2. react-native-pdf or react-native-pdf-lib - For PDF generation
3. react-native-fs - For file system access to save PDFs
4. react-native-camera or react-native-vision-camera - As a fallback camera solution

Alternative: Native Android (Kotlin)

If you prefer native development:
- OpenCV for Android - Industry-standard computer vision library for edge detection
- CameraX API - Modern Android camera framework
- iTextPDF or PDFBox - PDF generation
- ML Kit Document Scanner API - Google's machine learning solution for document scanning

Why React Native?

1. Faster development - Single codebase that can later be adapted for iOS
2. react-native-document-scanner-plugin handles most of the complex computer vision work
3. Good performance for this use case
4. Easier to maintain if you're not deeply familiar with native Android development

The document scanner plugin I mentioned uses OpenCV under the hood and provides:
- Automatic edge detection
- Perspective correction
- Image filters (grayscale, black & white, color enhancement)
- Cropping functionality

Would you like me to create a plan for building this app using React Native?
