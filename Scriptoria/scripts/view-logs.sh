#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}CamScanner Log Viewer${NC}"
echo "====================="
echo ""

# Check for devices
DEVICE_COUNT=$(adb devices | grep -v "List" | grep -c "device")

if [ $DEVICE_COUNT -eq 0 ]; then
    echo "No devices connected!"
    exit 1
elif [ $DEVICE_COUNT -eq 1 ]; then
    # Single device, use it
    DEVICE=$(adb devices | grep -v "List" | grep "device" | awk '{print $1}')
else
    # Multiple devices, let user choose
    echo "Multiple devices detected:"
    echo ""
    adb devices | grep -v "List" | grep "device" | nl
    echo ""
    echo "Choose device:"
    echo "1) Emulator (emulator-5554)"
    echo "2) Physical device"
    read -p "Selection: " choice
    
    if [ "$choice" = "1" ]; then
        DEVICE="emulator-5554"
    else
        DEVICE=$(adb devices | grep -v "List" | grep -v "emulator" | grep "device" | awk '{print $1}')
    fi
fi

echo -e "${YELLOW}Viewing logs from: $DEVICE${NC}"
echo "Filter: Document sharing and errors"
echo "Press Ctrl+C to stop"
echo ""

# Clear old logs and start monitoring
adb -s $DEVICE logcat -c
adb -s $DEVICE logcat ReactNativeJS:V *:S | grep -E "(Document|Share|path|Error|console.log)"