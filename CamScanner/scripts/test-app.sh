#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}CamScanner Test & Debug Helper${NC}"
echo "================================="
echo ""

# Check for connected devices
echo -e "${GREEN}Checking for connected devices...${NC}"
DEVICES=$(adb devices | grep -v "List of devices attached" | grep -v "^$")

if echo "$DEVICES" | grep -q "device"; then
    DEVICE_COUNT=$(echo "$DEVICES" | grep "device" | wc -l | tr -d ' ')
    echo -e "${GREEN}✓ Found $DEVICE_COUNT device(s) connected:${NC}"
    echo "$DEVICES" | grep "device" | while read line; do
        DEVICE_ID=$(echo $line | cut -d$'\t' -f1)
        echo "  - Device: $DEVICE_ID"
    done
elif echo "$DEVICES" | grep -q "emulator"; then
    echo -e "${GREEN}✓ Emulator is running${NC}"
else
    echo -e "${YELLOW}! No devices or emulators detected${NC}"
    echo "  Please connect your device or start an emulator"
    echo "  Then run this script again"
    exit 1
fi

# Start Metro bundler in background
echo ""
echo -e "${GREEN}Starting Metro bundler...${NC}"
npx react-native start --reset-cache &
METRO_PID=$!

# Wait for Metro to start
sleep 5

# Install and run the app
echo ""
echo -e "${GREEN}Building and installing app...${NC}"
npx react-native run-android

# Show debugging options
echo ""
echo -e "${GREEN}App is running!${NC}"
echo ""
echo "Debug Options:"
echo "1. Shake your device or press Cmd+M for debug menu"
echo "2. View logs: npx react-native log-android"
echo "3. View device logs: adb logcat | grep CamScanner"
echo "4. Open Chrome DevTools: chrome://inspect"
echo "5. Open Flipper for advanced debugging"
echo ""
echo "Useful ADB Commands:"
echo "• Check device: adb devices"
echo "• View full logs: adb logcat"
echo "• Clear logs: adb logcat -c"
echo "• Install APK: adb install -r android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop Metro bundler${NC}"

# Wait for user to stop
wait $METRO_PID