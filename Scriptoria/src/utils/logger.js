// Debug Logger - Conditional logging utility for Scriptoria
// Automatically disables logging in production builds

const __DEV__ = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

/**
 * Logger utility that conditionally logs based on environment
 * In production builds, all logging is disabled for performance
 */
class Logger {
  /**
   * Log informational messages (replaces console.log)
   * @param {...any} args - Arguments to log
   */
  static log(...args) {
    if (__DEV__) {
      console.log(...args);
    }
  }

  /**
   * Log warning messages (replaces console.warn)
   * @param {...any} args - Arguments to log
   */
  static warn(...args) {
    if (__DEV__) {
      console.warn(...args);
    }
  }

  /**
   * Log error messages (replaces console.error)
   * Note: In production, errors are still logged as they're critical
   * @param {...any} args - Arguments to log
   */
  static error(...args) {
    if (__DEV__) {
      console.error(...args);
    } else {
      // In production, still log errors but without extra context
      console.error('Error occurred');
    }
  }

  /**
   * Log debug information with prefix for easy filtering
   * @param {string} component - Component or module name
   * @param {...any} args - Arguments to log
   */
  static debug(component, ...args) {
    if (__DEV__) {
      console.log(`[${component}]`, ...args);
    }
  }

  /**
   * Log file operations for debugging
   * @param {string} operation - Operation type (e.g., 'create', 'delete', 'rename')
   * @param {string} path - File path
   * @param {...any} args - Additional arguments
   */
  static fileOp(operation, path, ...args) {
    if (__DEV__) {
      console.log(`[FileOp:${operation}]`, path, ...args);
    }
  }
}

export default Logger;