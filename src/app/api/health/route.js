import { NextResponse } from 'next/server';

/**
 * Health check endpoint for container health monitoring
 * This endpoint is used by Docker healthcheck and cloud monitoring services
 * to verify application availability
 */
export async function GET() {
  try {
    // In a production environment, this would check:
    // 1. Database connectivity
    // 2. Cache availability
    // 3. Third-party API dependencies
    // 4. System resources

    // Simple health status response
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
      services: {
        api: 'operational',
        database: 'operational',
        auth: 'operational'
      },
      uptime: process.uptime()
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 });
  }
} 