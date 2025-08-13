# Logger Utility

## Overview

The Logger utility provides conditional logging that automatically disables debug output in production builds while maintaining critical error logging.

## Features

- **Development Mode**: Full logging with component prefixes and detailed output
- **Production Mode**: Minimal logging to reduce performance overhead
- **Structured Logging**: Consistent format across all components
- **File Operation Tracking**: Specialized logging for file system operations

## Usage

```javascript
import Logger from '../utils/logger';

// Basic logging
Logger.log('Application started');                    // Dev only
Logger.error('Authentication failed');                // Always logged
Logger.warn('Deprecated API usage');                  // Dev only

// Component-specific debugging
Logger.debug('HomeScreen', 'Loading documents');      // Dev only

// File operation tracking
Logger.fileOp('create', '/path/to/file');             // Dev only
Logger.fileOp('rename', oldPath, '→', newPath);       // Dev only
```

## Production Behavior

In production builds (`__DEV__ = false`):
- `Logger.log()` → Silent
- `Logger.warn()` → Silent  
- `Logger.debug()` → Silent
- `Logger.fileOp()` → Silent
- `Logger.error()` → Logs "Error occurred" (no sensitive details)

## Benefits

- **Performance**: Zero logging overhead in production
- **Security**: No sensitive information leakage in production logs
- **Development**: Rich debugging information during development
- **Consistency**: Unified logging interface across all components