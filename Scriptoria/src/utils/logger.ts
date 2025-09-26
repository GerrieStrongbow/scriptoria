// Debug Logger - Conditional logging utility for Scriptoria
// Automatically disables logging in production builds

const isDevEnvironment = () => (typeof __DEV__ !== 'undefined' ? __DEV__ : false);

const normaliseErrorMessage = (args: unknown[]): string => {
  if (!args || args.length === 0) {
    return 'Error occurred';
  }

  const [firstArg] = args;
  if (firstArg instanceof Error) {
    return firstArg.message;
  }

  if (typeof firstArg === 'string') {
    return firstArg;
  }

  try {
    return JSON.stringify(firstArg);
  } catch (error) {
    return 'Error occurred';
  }
};

/**
 * Logger utility that conditionally logs based on environment.
 * In production builds, verbose logging is disabled for performance.
 */
class Logger {
  static get isDev(): boolean {
    return isDevEnvironment();
  }

  /** Log informational messages (replaces console.log). */
  static log(...args: unknown[]): void {
    if (Logger.isDev) {
      console.log(...args);
    }
  }

  /** Log warning messages (replaces console.warn). */
  static warn(...args: unknown[]): void {
    if (Logger.isDev) {
      console.warn(...args);
    }
  }

  /**
   * Log error messages (replaces console.error).
   * In production, errors are reduced to their message to avoid leaking details.
   */
  static error(...args: unknown[]): void {
    if (Logger.isDev) {
      console.error(...args);
    } else {
      console.error(normaliseErrorMessage(args));
    }
  }

  /** Log debug information with a component/module prefix for filtering. */
  static debug(component: string, ...args: unknown[]): void {
    if (Logger.isDev) {
      console.log(`[${component}]`, ...args);
    }
  }

  /** Log file-system operations for debugging persistent storage behaviour. */
  static fileOp(operation: string, path: string, ...args: unknown[]): void {
    if (Logger.isDev) {
      console.log(`[FileOp:${operation}]`, path, ...args);
    }
  }
}

export default Logger;
