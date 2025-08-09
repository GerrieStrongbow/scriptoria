#!/bin/bash

# Script to set up release signing configuration in build.gradle

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_GRADLE="$SCRIPT_DIR/../android/app/build.gradle"

echo "📝 Setting up release signing configuration..."

# Create a backup of build.gradle
cp "$BUILD_GRADLE" "$BUILD_GRADLE.backup"

# Read the current build.gradle content
BUILD_GRADLE_CONTENT=$(<"$BUILD_GRADLE")

# Check if keystore configuration already exists
if grep -q "keystoreProperties" "$BUILD_GRADLE"; then
    echo "✅ Keystore configuration already exists in build.gradle"
    exit 0
fi

# Create the new build.gradle with keystore configuration
cat > "$BUILD_GRADLE.tmp" << 'EOF'
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

// Load keystore properties
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

EOF

# Append the rest of the original file (skipping the first 3 lines)
tail -n +4 "$BUILD_GRADLE" >> "$BUILD_GRADLE.tmp"

# Now update the signingConfigs section
sed -i.bak '
/signingConfigs {/,/^    }/ {
    /^    }/ i\
        release {\
            if (keystorePropertiesFile.exists()) {\
                storeFile file(keystoreProperties["storeFile"])\
                storePassword keystoreProperties["storePassword"]\
                keyAlias keystoreProperties["keyAlias"]\
                keyPassword keystoreProperties["keyPassword"]\
            }\
        }
}' "$BUILD_GRADLE.tmp"

# Update the release buildType to use release signingConfig
sed -i.bak 's/signingConfig signingConfigs.debug/signingConfig signingConfigs.release/' "$BUILD_GRADLE.tmp"

# Move the temporary file to the original
mv "$BUILD_GRADLE.tmp" "$BUILD_GRADLE"

# Clean up backup files
rm -f "$BUILD_GRADLE.tmp.bak"

echo "✅ Release signing configuration added to build.gradle"
echo ""
echo "📋 Next steps:"
echo "1. Generate a keystore: ./scripts/generate-keystore.sh"
echo "2. Create android/keystore.properties with your keystore details"
echo "3. Build release: cd android && ./gradlew bundleRelease"