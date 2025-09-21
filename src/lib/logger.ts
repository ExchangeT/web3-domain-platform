// Logger utility for consistent logging across the application

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
  source?: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, data?: unknown, source?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      source: source || 'app'
    }
  }

  private log(level: LogLevel, message: string, data?: unknown, source?: string) {
    const logEntry = this.formatMessage(level, message, data, source)
    
    // Always log errors, even in production
    if (level === 'error') {
      console.error(`[${logEntry.source}] ${message}`, data || '')
      return
    }

    // Only log other levels in development
    if (this.isDevelopment) {
      const method = level === 'debug' ? 'log' : level
      console[method](`[${logEntry.source}] ${message}`, data || '')
    }

    // In production, you might want to send logs to a service
    if (this.isProduction && level !== 'debug') {
      // Example: Send to logging service
      // this.sendToLoggingService(logEntry)
    }
  }

  debug(message: string, data?: unknown, source?: string) {
    this.log('debug', message, data, source)
  }

  info(message: string, data?: unknown, source?: string) {
    this.log('info', message, data, source)
  }

  warn(message: string, data?: unknown, source?: string) {
    this.log('warn', message, data, source)
  }

  error(message: string, data?: unknown, source?: string) {
    this.log('error', message, data, source)
  }

  // Web3 specific logging
  web3 = {
    connect: (address: string) => this.info(`Wallet connected: ${address}`, undefined, 'web3'),
    disconnect: () => this.info('Wallet disconnected', undefined, 'web3'),
    networkChange: (chainId: number) => this.info(`Network changed to: ${chainId}`, undefined, 'web3'),
    transaction: (txHash: string, type: string) => this.info(`Transaction ${type}: ${txHash}`, undefined, 'web3'),
    error: (message: string, error?: unknown) => this.error(`Web3 Error: ${message}`, error, 'web3')
  }

  // API specific logging
  api = {
    request: (endpoint: string, method: string) => this.debug(`API ${method} ${endpoint}`, undefined, 'api'),
    response: (endpoint: string, status: number, data?: unknown) => this.debug(`API Response ${status} ${endpoint}`, data, 'api'),
    error: (endpoint: string, error: unknown) => this.error(`API Error ${endpoint}`, error, 'api')
  }

  // Auth specific logging
  auth = {
    login: (address: string) => this.info(`User logged in: ${address}`, undefined, 'auth'),
    logout: () => this.info('User logged out', undefined, 'auth'),
    error: (message: string, error?: unknown) => this.error(`Auth Error: ${message}`, error, 'auth')
  }
}

// Create singleton instance
export const logger = new Logger()

// Export for convenience
export default logger
