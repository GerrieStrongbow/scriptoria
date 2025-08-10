#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}Scriptoria Debug Logs${NC}"
echo "===================="
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

echo -e "${YELLOW}Choose logging option:${NC}"
echo "1. React Native logs only (recommended)"
echo "2. Full Android logcat (verbose)"
echo "3. Scriptoria app logs only"
echo "4. Clear logs and start fresh"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}Starting React Native logs...${NC}"
        echo "Press Ctrl+C to stop"
        echo ""
        npx react-native log-android
        ;;
    2)
        echo -e "${GREEN}Starting full Android logcat...${NC}"
        echo "Press Ctrl+C to stop"
        echo ""
        adb logcat
        ;;
    3)
        echo -e "${GREEN}Starting Scriptoria app logs...${NC}"
        echo "Press Ctrl+C to stop"
        echo ""
        adb logcat | grep -i "scriptoria\|reactnativejs\|console"
        ;;
    4)
        echo -e "${GREEN}Clearing logs...${NC}"
        adb logcat -c
        echo "Logs cleared. Starting fresh React Native logs..."
        echo "Press Ctrl+C to stop"
        echo ""
        npx react-native log-android
        ;;
    *)
        echo -e "${RED}Invalid choice. Defaulting to React Native logs...${NC}"
        npx react-native log-android
        ;;
esac