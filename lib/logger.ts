// ==============================================================================
// Care Beauty Solution - Structured JSON Logging Engine
// Spec Section 42 & 43: JSON formatting, correlated with requestId & traceId
// Levels: DEBUG, INFO, WARN, ERROR, FATAL
// ==============================================================================

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface StructuredLogPayload {
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  requestId?: string;
  traceId?: string;
  userId?: string;
  route?: string;
  status?: number;
  latencyMs?: number;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const LOG_LEVELS: Record<LogLevel, number> = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
  FATAL: 50,
};

const currentLevelThreshold = LOG_LEVELS[(process.env.LOG_LEVEL?.toUpperCase() as LogLevel) || 'INFO'] ?? 20;

function emitLog(payload: StructuredLogPayload) {
  if (LOG_LEVELS[payload.level] < currentLevelThreshold) {
    return;
  }

  // Filter sensitive fields (passwords, tokens, payment secrets)
  const sanitized = JSON.parse(
    JSON.stringify(payload, (key, value) => {
      const lower = key.toLowerCase();
      if (lower.includes('password') || lower.includes('secret') || lower.includes('token') || lower.includes('auth')) {
        return '[REDACTED]';
      }
      return value;
    })
  );

  const jsonString = JSON.stringify(sanitized);

  if (payload.level === 'ERROR' || payload.level === 'FATAL') {
    console.error(jsonString);
  } else if (payload.level === 'WARN') {
    console.warn(jsonString);
  } else {
    console.log(jsonString);
  }
}

export const logger = {
  debug: (message: string, meta?: Partial<StructuredLogPayload>) => {
    emitLog({
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      service: 'care-storefront',
      environment: process.env.NODE_ENV || 'development',
      message,
      ...meta,
    });
  },
  info: (message: string, meta?: Partial<StructuredLogPayload>) => {
    emitLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      service: 'care-storefront',
      environment: process.env.NODE_ENV || 'development',
      message,
      ...meta,
    });
  },
  warn: (message: string, meta?: Partial<StructuredLogPayload>) => {
    emitLog({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      service: 'care-storefront',
      environment: process.env.NODE_ENV || 'development',
      message,
      ...meta,
    });
  },
  error: (message: string, error?: Error | unknown, meta?: Partial<StructuredLogPayload>) => {
    emitLog({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      service: 'care-storefront',
      environment: process.env.NODE_ENV || 'development',
      message,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
      ...meta,
    });
  },
  fatal: (message: string, error?: Error | unknown, meta?: Partial<StructuredLogPayload>) => {
    emitLog({
      timestamp: new Date().toISOString(),
      level: 'FATAL',
      service: 'care-storefront',
      environment: process.env.NODE_ENV || 'development',
      message,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
      ...meta,
    });
  },
};
