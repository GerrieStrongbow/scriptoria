#!/bin/bash

echo "React Native Debugging Setup"
echo "============================"
echo ""
echo "1. Chrome DevTools (Basic):"
echo "   - Shake device or press Cmd+D (iOS) / Cmd+M (Android emulator)"
echo "   - Select 'Debug JS Remotely'"
echo "   - Chrome will open at http://localhost:8081/debugger-ui"
echo ""
echo "2. React Native Debugger (Advanced):"
echo "   - Install: brew install --cask react-native-debugger"
echo "   - Run: open 'rndebugger://set-debugger-loc?host=localhost&port=8081'"
echo ""
echo "3. Flipper (Recommended):"
echo "   - Install: brew install --cask flipper"
echo "   - Your app already has Flipper integrated"
echo "   - Just run Flipper and it will auto-connect"
echo ""
echo "4. Console Logs:"
echo "   - Run: npx react-native log-android"
echo "   - Or: adb logcat *:S ReactNative:V ReactNativeJS:V"
echo ""
echo "5. Live Reload:"
echo "   - Shake device > Enable Fast Refresh"
echo ""

# Check if React Native Debugger is installed
if command -v rndebugger &> /dev/null; then
    echo "✓ React Native Debugger is installed"
else
    echo "✗ React Native Debugger not installed"
    echo "  Install with: brew install --cask react-native-debugger"
fi

# Check if Flipper is installed
if [ -d "/Applications/Flipper.app" ]; then
    echo "✓ Flipper is installed"
else
    echo "✗ Flipper not installed"
    echo "  Install with: brew install --cask flipper"
fi