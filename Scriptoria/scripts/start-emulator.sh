#!/bin/bash

# Add Android SDK to PATH
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# List available AVDs
echo "Available Android Virtual Devices:"
emulator -list-avds

# Check if any AVDs exist
AVD_COUNT=$(emulator -list-avds | wc -l)
if [ $AVD_COUNT -eq 0 ]; then
    echo ""
    echo "No AVDs found. Please create one using Android Studio:"
    echo "1. Open Android Studio"
    echo "2. Go to Tools > AVD Manager"
    echo "3. Create a new Virtual Device"
    echo "4. Choose a device (e.g., Pixel 4)"
    echo "5. Download a system image (e.g., Android 11 or 12)"
    exit 1
fi

# Get the first AVD
AVD_NAME=$(emulator -list-avds | head -n 1)

echo ""
echo "Starting emulator: $AVD_NAME"
echo "This may take a few minutes..."

# Start the emulator
emulator -avd "$AVD_NAME" &