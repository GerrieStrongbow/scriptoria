#!/bin/bash

# Script to create a simple placeholder icon for Scriptoria
# This creates a basic icon using ImageMagick

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ASSETS_DIR="$SCRIPT_DIR/../assets"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed."
    echo "Please install it first: brew install imagemagick"
    exit 1
fi

echo "🎨 Creating placeholder icon for Scriptoria..."

mkdir -p "$ASSETS_DIR"

# Create a 1024x1024 placeholder icon
convert -size 1024x1024 \
    -background "#2196F3" \
    -fill "#2196F3" \
    canvas:#2196F3 \
    -fill white \
    -draw "roundrectangle 200,300 824,724 50,50" \
    -fill "#2196F3" \
    -draw "polygon 624,300 824,300 824,500" \
    -fill white \
    -draw "circle 512,600 512,450" \
    -fill "#2196F3" \
    -draw "circle 512,600 512,480" \
    -fill white \
    -font Helvetica-Bold \
    -pointsize 120 \
    -gravity South \
    -annotate +0+150 "S" \
    "$ASSETS_DIR/icon-1024.png"

echo "✅ Placeholder icon created at: assets/icon-1024.png"
echo ""
echo "📋 Next steps:"
echo "1. Run ./scripts/generate-app-icons.sh to generate all icon sizes"
echo "2. Or create a professional icon and save it as assets/icon-1024.png"