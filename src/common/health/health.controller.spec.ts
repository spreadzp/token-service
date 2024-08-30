import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HttpHealthIndicator } from '@nestjs/terminus';
import { Request } from 'express';

describe('HealthController', () => {
  let controller: HealthController;
  let httpHealthIndicator: HttpHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HttpHealthIndicator,
          useValue: {
            responseCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return status "up" when the API server is healthy', async () => {
      const request = { headers: { host: 'localhost:3000' } } as Request;
      const mockHealthIndicatorResult: any = {
        status: 'up',
        info: {
          name: 'API server',
        },
      };

      jest
        .spyOn(httpHealthIndicator, 'responseCheck')
        .mockResolvedValue(mockHealthIndicatorResult);

      const result = await controller.check(request);

      expect(result).toEqual({
        status: 'up',
        info: {
          apiServer: {
            status: 'up',
            ...mockHealthIndicatorResult,
          },
        },
        error: {},
        details: {
          apiServer: {
            status: 'up',
            ...mockHealthIndicatorResult,
          },
        },
      });
    });

    it('should return status "down" when the API server is not healthy', async () => {
      const request = { headers: { host: 'localhost:3000' } } as Request;
      const mockError = new Error('API server is down');

      jest
        .spyOn(httpHealthIndicator, 'responseCheck')
        .mockRejectedValue(mockError);

      const result = await controller.check(request);

      expect(result).toEqual({
        status: 'down',
        info: {},
        error: 'API server is down',
        details: {},
      });
    });
  });
});
