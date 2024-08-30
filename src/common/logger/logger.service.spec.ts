import { Test, TestingModule } from '@nestjs/testing';
import LoggerService from './logger.service';
import Logger, { LogLevel, LogData, LoggerBaseKey } from './logger.type';
import { INQUIRER } from '@nestjs/core';

describe('LoggerService', () => {
  let service: LoggerService;
  let mockLogger: Logger;
  let mockParentClass: object;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
      emergency: jest.fn(),
      startProfile: jest.fn(),
    };

    mockParentClass = { constructor: { name: 'TestParentClass' } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        { provide: LoggerBaseKey, useValue: mockLogger },
        { provide: INQUIRER, useValue: mockParentClass },
      ],
    }).compile();

    service = await module.resolve<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log a message with the correct log level and data', () => {
    const level: LogLevel = LogLevel.Info;
    const message = 'Test message';
    const data: LogData = { props: { customData: 'value' } };

    service.log(level, message, data);

    expect(mockLogger.log).toHaveBeenCalledWith(
      level,
      message,
      {
        ...data,
        sourceClass: 'TestParentClass',
      },
      undefined,
    );
  });

  it('should call the correct log level method with the correct data', () => {
    const message = 'Test debug message';
    const data: LogData = { props: { debugData: 'debugValue' } };

    service.debug(message, data);

    expect(mockLogger.debug).toHaveBeenCalledWith(
      message,
      {
        ...data,
        sourceClass: 'TestParentClass',
      },
      undefined,
    );
  });

  it('should handle error messages correctly', () => {
    const message = new Error('Test error');
    const data: LogData = { props: { errorData: 'errorValue' } };

    service.error(message, data);

    expect(mockLogger.error).toHaveBeenCalledWith(
      message,
      {
        ...data,
        sourceClass: 'TestParentClass',
      },
      undefined,
    );
  });

  it('should call startProfile with the correct id', () => {
    const profileId = 'profile-test-id';

    service.startProfile(profileId);

    expect(mockLogger.startProfile).toHaveBeenCalledWith(profileId);
  });
});
