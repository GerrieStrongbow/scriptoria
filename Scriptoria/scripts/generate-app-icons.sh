#!/bin/bash

# Script to generate app icons for DocuSnap
# Requires ImageMagick to be installed: brew install imagemagick

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ANDROID_RES_DIR="$SCRIPT_DIR/../android/app/src/main/res"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed."
    echo "Please install it first: brew install imagemagick"
    exit 1
fi

# Check if source icon exists
SOURCE_ICON="$SCRIPT_DIR/../assets/icon-1024.png"
if [ ! -f "$SOURCE_ICON" ]; then
    echo "❌ Source icon not found at: $SOURCE_ICON"
    echo "Please create a 1024x1024 PNG icon and save it as assets/icon-1024.png"
    exit 1
fi

echo "🎨 Generating app icons for DocuSnap..."

# Android icon sizes
declare -A ANDROID_SIZES=(
    ["mipmap-mdpi"]=48
    ["mipmap-hdpi"]=72
    ["mipmap-xhdpi"]=96
    ["mipmap-xxhdpi"]=144
    ["mipmap-xxxhdpi"]=192
)

# Generate Android icons
for DENSITY in "${!ANDROID_SIZES[@]}"; do
    SIZE="${ANDROID_SIZES[$DENSITY]}"
    OUTPUT_DIR="$ANDROID_RES_DIR/$DENSITY"
    
    echo "📱 Generating $DENSITY icon ($SIZE×$SIZE)..."
    
    # Generate regular icon
    convert "$SOURCE_ICON" \
        -resize "${SIZE}x${SIZE}" \
        -unsharp 0x1 \
        "$OUTPUT_DIR/ic_launcher.png"
    
    # Generate round icon (with circular mask)
    convert "$SOURCE_ICON" \
        -resize "${SIZE}x${SIZE}" \
        \( +clone -alpha extract \
           -draw "fill black polygon 0,0 0,$SIZE $SIZE,$SIZE $SIZE,0" \
           -blur 0x8 \
        \) -alpha off -compose CopyOpacity -composite \
        -unsharp 0x1 \
        "$OUTPUT_DIR/ic_launcher_round.png"
done

# Generate Play Store icon
PLAY_STORE_DIR="$SCRIPT_DIR/../assets/play-store"
mkdir -p "$PLAY_STORE_DIR"

echo "🏪 Generating Play Store icon (512×512)..."
convert "$SOURCE_ICON" \
    -resize 512x512 \
    -unsharp 0x1 \
    "$PLAY_STORE_DIR/icon-512.png"

echo ""
echo "✅ App icons generated successfully!"
echo ""
echo "📋 Generated icons:"
echo "- Android app icons in: android/app/src/main/res/mipmap-*/"
echo "- Play Store icon in: assets/play-store/icon-512.png"
echo ""
echo "💡 Tips:"
echo "1. Review the generated icons to ensure they look good"
echo "2. The round icons are used on devices with circular app icons"
echo "3. You may want to manually fine-tune the icons for better results"