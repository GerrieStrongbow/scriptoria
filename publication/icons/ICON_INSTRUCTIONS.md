# Scriptoria App Icon Creation Guide

## Design Concept

The icon features a medieval manuscript page with a quill feather, perfectly representing Scriptoria's document scanning with manuscript aesthetics.

**IMPORTANT:** Follow Google's adaptive icon guidelines - create square icons without rounded corners. Android will automatically apply rounding, shadows, and visual effects through the adaptive icon system.

## Color Palette (from Scriptoria theme)
- **Background**: #F8F1E7 (Parchment Beige)
- **Gold Accent**: #C6A664 (Burnished Gold) 
- **Dark Text**: #1E1B18 (Ink Black)
- **Border**: #D8CBB9 (Parchment Border)
- **Secondary**: #4B3621 (Deep Umber)

## Icon Specifications

### Required Android Sizes
- **48x48** (mdpi) - Place in `android/app/src/main/res/mipmap-mdpi/`
- **72x72** (hdpi) - Place in `android/app/src/main/res/mipmap-hdpi/`
- **96x96** (xhdpi) - Place in `android/app/src/main/res/mipmap-xhdpi/`
- **144x144** (xxhdpi) - Place in `android/app/src/main/res/mipmap-xxhdpi/`
- **192x192** (xxxhdpi) - Place in `android/app/src/main/res/mipmap-xxxhdpi/`

All files should be named `ic_launcher.png`

## Design Elements

### 1. Base Shape
- **Square format** (1:1 aspect ratio) - NO rounded corners
- Warm parchment background (#F8F1E7)
- Keep important content within center 66% (safe zone for adaptive cropping)

### 2. Central Element
- Elegant quill feather in burnished gold (#C6A664)
- Positioned diagonally from bottom-left to top-right (within safe zone)
- Feather shaft in deep umber (#4B3621)
- Ensure feather remains recognizable when cropped to circle or rounded square

### 3. Manuscript Details
- **Avoid border elements** near edges (will be cropped by adaptive system)
- Small decorative dots within safe zone (gold)
- Faint horizontal lines suggesting text/documents (keep centered)
- Design should work well in circle, rounded square, and other adaptive shapes

## Quick Creation Options

### Option A: Use Figma (Free)
1. Create new design with 192x192 canvas
2. Add rounded rectangle background
3. Use pen tool to draw quill shape
4. Apply gradients and colors
5. Export as PNG in all required sizes

### Option B: Use Canva
1. Create custom design 192x192
2. Use shapes to build the icon
3. Apply Scriptoria colors
4. Download and resize for other dimensions

### Option C: Commission a Designer
- Provide this specification document
- Reference the SVG file I created
- Should cost $20-50 on Fiverr/Upwork

## Alternative Simple Design

If the quill is too complex, here's a simpler approach:

### Minimalist Document Icon
- **Square parchment background** (no rounded corners)
- Simple document outline in center (white/cream)
- Small gold accent within safe zone (avoid corners/borders)
- Clean, recognizable at small sizes and adaptive shapes

### Elements:
- Background: #F8F1E7
- Document shape: #FFFBF4 with #D8CBB9 border
- Gold accent: #C6A664
- Keep it simple and scalable

## Testing Your Icons

Before submitting:
1. View icons at actual size on device
2. Test readability at 48x48 (smallest size)
3. Ensure consistency across all density sizes
4. **Test adaptive icon behavior:** preview how icon looks when cropped to circles, rounded rectangles
5. Verify colors match app theme
6. Check that important elements remain visible in center 66% safe zone

## Installation

Once you have the PNG files:

```bash
# Copy to correct directories
cp ic_launcher_48.png android/app/src/main/res/mipmap-mdpi/ic_launcher.png
cp ic_launcher_72.png android/app/src/main/res/mipmap-hdpi/ic_launcher.png
cp ic_launcher_96.png android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
cp ic_launcher_144.png android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
cp ic_launcher_192.png android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

Then rebuild your app:
```bash
cd android && ./gradlew clean && cd .. && npx react-native run-android
```