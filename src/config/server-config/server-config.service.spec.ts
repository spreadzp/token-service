import { Test, TestingModule } from '@nestjs/testing';
import { ServerConfig } from './server-config.service';
import { ConfigService } from '@nestjs/config';

describe('ServerConfig', () => {
  let service: ServerConfig;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServerConfig,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(), // Mock the `get` method
          },
        },
      ],
    }).compile();

    service = module.get<ServerConfig>(ServerConfig);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return the correct host', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('127.0.0.1');
    expect(service.host).toBe('127.0.0.1');
    expect(configService.get).toHaveBeenCalledWith('HOST', 'localhost');
  });

  it('should return the correct port', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce(8080);
    expect(service.port).toBe(8080);
    expect(configService.get).toHaveBeenCalledWith('PORT', 3030);
  });

  it('should return the correct secret', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('supersecret');
    expect(service.secret).toBe('supersecret');
    expect(configService.get).toHaveBeenCalledWith('JWT_SECRET', '');
  });

  it('should return the correct serverHost', () => {
    jest.spyOn(configService, 'get').mockReturnValueOnce('server.example.com');
    expect(service.serverHost).toBe('server.example.com');
    expect(configService.get).toHaveBeenCalledWith('SERVER_HOST', 'localhost');
  });
});
