import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HttpHealthIndicator,
  HealthCheck,
  HealthIndicatorResult,
  HealthIndicatorStatus,
} from '@nestjs/terminus';
import { Request } from 'express';

export type HealthCheckResult = {
  status: HealthIndicatorStatus;
  info?: {
    [key: string]: HealthIndicatorResult;
  };
  error?: any;
  details?: {
    [key: string]: any;
  };
};

@ApiTags('Health check')
@Controller('health')
export class HealthController {
  constructor(private http: HttpHealthIndicator) {}

  @Get()
  @HealthCheck()
  async check(@Req() request: Request): Promise<HealthCheckResult> {
    const host = this.getHostFromRequest(request);
    const apiUrl = `http://${host}/api`;

    try {
      const responseCheckApi: HealthIndicatorResult =
        await this.http.responseCheck(
          `API server works on ${apiUrl}`,
          apiUrl,
          (res) => res.status === 200,
        );

      return {
        status: 'up',
        info: {
          apiServer: responseCheckApi,
        },
        error: {},
        details: {
          apiServer: responseCheckApi,
        },
      };
    } catch (error) {
      return {
        status: 'down',
        info: {},
        error: error.message,
        details: {},
      };
    }
  }

  private getHostFromRequest(request: Request): string {
    const hostHeader = request.headers['host'] as string;
    return hostHeader;
  }
}
