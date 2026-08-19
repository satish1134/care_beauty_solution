import { queryDb } from './db';
import { getRedisClient } from './redis';
import { getCloudinary } from './cloudinary';
import { createCashfreeOrderServer } from './payments';

export interface HealthCheckResult {
  neonDb: { status: 'OK' | 'ERROR'; message: string; timestamp?: string };
  upstashRedis: { status: 'OK' | 'ERROR'; message: string; ping?: string };
  cloudinary: { status: 'OK' | 'ERROR'; message: string; cloudName?: string };
  cashfree: { status: 'OK' | 'ERROR'; message: string; mode?: string };
}

/**
 * Runs a complete diagnostic health check across all configured external infrastructure.
 */
export async function runInfrastructureHealthCheck(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    neonDb: { status: 'ERROR', message: 'Not tested' },
    upstashRedis: { status: 'ERROR', message: 'Not tested' },
    cloudinary: { status: 'ERROR', message: 'Not tested' },
    cashfree: { status: 'ERROR', message: 'Not tested' },
  };

  // 1. Neon DB Test
  try {
    const rows = await queryDb<{ current_time: string }>('SELECT NOW() as current_time');
    result.neonDb = {
      status: 'OK',
      message: 'Successfully connected to Neon Pooled PostgreSQL',
      timestamp: rows[0]?.current_time,
    };
  } catch (err: any) {
    result.neonDb = {
      status: 'ERROR',
      message: `Neon DB Error: ${err.message || err}`,
    };
  }

  // 2. Upstash Redis Test
  try {
    const redis = getRedisClient();
    await redis.set('healthcheck:ping', 'PONG', { ex: 30 });
    const pingRes = await redis.get<string>('healthcheck:ping');
    result.upstashRedis = {
      status: pingRes === 'PONG' ? 'OK' : 'ERROR',
      message: pingRes === 'PONG' ? 'Upstash Redis REST operational' : 'Unexpected Redis value',
      ping: pingRes || undefined,
    };
  } catch (err: any) {
    result.upstashRedis = {
      status: 'ERROR',
      message: `Upstash Error: ${err.message || err}`,
    };
  }

  // 3. Cloudinary Test
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName || cloudName === 'my_cloud_name') {
      result.cloudinary = {
        status: 'ERROR',
        message: 'CLOUDINARY_CLOUD_NAME is unconfigured or using placeholder value',
      };
    } else {
      const instance = getCloudinary();
      result.cloudinary = {
        status: 'OK',
        message: 'Cloudinary SDK successfully initialized',
        cloudName: instance.config().cloud_name,
      };
    }
  } catch (err: any) {
    result.cloudinary = {
      status: 'ERROR',
      message: `Cloudinary Error: ${err.message || err}`,
    };
  }

  // 4. Cashfree PG Test
  try {
    const envMode = process.env.CASHFREE_ENV || 'SANDBOX';
    const mockOrder = await createCashfreeOrderServer({
      orderId: `health_chk_${Date.now()}`,
      orderAmount: 1.0,
      customerDetails: {
        customerId: 'cust_health_1',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '9999999999',
      },
    });

    result.cashfree = {
      status: 'OK',
      message: `Cashfree PG operational in ${envMode} mode. Session ID: ${mockOrder.payment_session_id}`,
      mode: envMode,
    };
  } catch (err: any) {
    result.cashfree = {
      status: 'ERROR',
      message: `Cashfree Error: ${err.message || err}`,
    };
  }

  return result;
}
