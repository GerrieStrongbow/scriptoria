#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Scriptoria Build & Test${NC}"
echo "======================="
echo ""

# Check if device is connected
if ! adb devices | grep -q "device"; then
    echo -e "${RED}❌ No device connected${NC}"
    echo "Please connect your device and try again"
    exit 1
fi

DEVICE=$(adb devices | grep "device" | head -1 | cut -f1)
echo -e "${GREEN}📱 Connected to device: $DEVICE${NC}"
echo ""

# Build the app
echo -e "${GREEN}Building and installing app...${NC}"
npx react-native run-android

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ App built and installed successfully!${NC}"
    echo ""
    echo "Now run the debug logs script to monitor app behavior:"
    echo -e "${YELLOW}./scripts/debug-logs.sh${NC}"
else
    echo -e "${RED}❌ Build failed. Check the errors above.${NC}"
    exit 1
fi