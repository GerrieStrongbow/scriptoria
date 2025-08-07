#!/bin/bash

# Script to build release APK and AAB for DocuSnap

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."
ANDROID_DIR="$PROJECT_DIR/android"

echo "📦 Building DocuSnap for release..."
echo ""

# Check if keystore.properties exists
if [ ! -f "$ANDROID_DIR/keystore.properties" ]; then
    echo "❌ keystore.properties not found!"
    echo ""
    echo "Please create $ANDROID_DIR/keystore.properties with:"
    echo "  storePassword=YOUR_STORE_PASSWORD"
    echo "  keyPassword=YOUR_KEY_PASSWORD"
    echo "  keyAlias=docusnap-key"
    echo "  storeFile=docusnap-release.keystore"
    echo ""
    echo "First run: ./scripts/generate-keystore.sh"
    exit 1
fi

# Check if keystore file exists
if [ ! -f "$ANDROID_DIR/app/docusnap-release.keystore" ]; then
    echo "❌ Release keystore not found!"
    echo "Please run: ./scripts/generate-keystore.sh"
    exit 1
fi

cd "$ANDROID_DIR" || exit 1

echo "🧹 Cleaning previous builds..."
./gradlew clean

echo ""
echo "📱 Building release APK..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo "✅ APK built successfully!"
    APK_PATH="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_PATH" ]; then
        echo "📍 APK location: $APK_PATH"
        APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "📊 APK size: $APK_SIZE"
    fi
else
    echo "❌ APK build failed!"
    exit 1
fi

echo ""
echo "📦 Building release AAB (for Play Store)..."
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo "✅ AAB built successfully!"
    AAB_PATH="$ANDROID_DIR/app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$AAB_PATH" ]; then
        echo "📍 AAB location: $AAB_PATH"
        AAB_SIZE=$(du -h "$AAB_PATH" | cut -f1)
        echo "📊 AAB size: $AAB_SIZE"
    fi
else
    echo "❌ AAB build failed!"
    exit 1
fi

# Create a release directory
RELEASE_DIR="$PROJECT_DIR/releases/v$(grep versionName "$ANDROID_DIR/app/build.gradle" | awk '{print $2}' | tr -d '"')"
mkdir -p "$RELEASE_DIR"

echo ""
echo "📂 Copying release files to: $RELEASE_DIR"
cp "$APK_PATH" "$RELEASE_DIR/DocuSnap.apk" 2>/dev/null
cp "$AAB_PATH" "$RELEASE_DIR/DocuSnap.aab" 2>/dev/null

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test the APK on a physical device: $RELEASE_DIR/DocuSnap.apk"
echo "2. Upload the AAB to Google Play Console: $RELEASE_DIR/DocuSnap.aab"
echo "3. Prepare store listing (screenshots, description, etc.)"
echo ""
echo "💡 Tips:"
echo "- The AAB file is what you upload to Google Play Store"
echo "- The APK can be used for testing or direct distribution"
echo "- Always test on multiple devices before releasing"