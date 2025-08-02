#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}CamScanner Test & Debug Helper${NC}"
echo "================================="
echo ""

# Check if emulator is running
if adb devices | grep -q "emulator"; then
    echo -e "${GREEN}✓ Emulator is running${NC}"
else
    echo -e "${YELLOW}! No emulator detected${NC}"
    echo "  Starting emulator..."
    ./scripts/start-emulator.sh
    echo "  Waiting for emulator to boot..."
    adb wait-for-device
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
echo "1. Press Cmd+M in emulator for debug menu"
echo "2. View logs: npx react-native log-android"
echo "3. Open Flipper for advanced debugging"
echo ""
echo "Press Ctrl+C to stop Metro bundler"

# Wait for user to stop
wait $METRO_PID