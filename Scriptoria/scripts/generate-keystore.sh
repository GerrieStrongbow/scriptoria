#!/bin/bash

# Script to generate a release keystore for DocuSnap

KEYSTORE_DIR="../android/app"
KEYSTORE_FILE="docusnap-release.keystore"
KEY_ALIAS="docusnap-key"

echo "🔑 Generating release keystore for DocuSnap..."
echo ""
echo "⚠️  IMPORTANT: Remember your passwords and keep this keystore file safe!"
echo "You'll need it for all future app updates."
echo ""

# Navigate to the keystore directory
cd "$(dirname "$0")" || exit 1

# Generate the keystore
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore "$KEYSTORE_DIR/$KEYSTORE_FILE" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Keystore generated successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Create a file: android/keystore.properties"
    echo "2. Add the following content (replace with your actual passwords):"
    echo ""
    echo "storePassword=YOUR_STORE_PASSWORD"
    echo "keyPassword=YOUR_KEY_PASSWORD"
    echo "keyAlias=$KEY_ALIAS"
    echo "storeFile=$KEYSTORE_FILE"
    echo ""
    echo "3. Add these files to .gitignore:"
    echo "   - android/app/$KEYSTORE_FILE"
    echo "   - android/keystore.properties"
else
    echo "❌ Failed to generate keystore"
    exit 1
fi