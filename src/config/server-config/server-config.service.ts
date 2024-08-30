import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfig {
  constructor(private readonly configService: ConfigService) {}

  get host(): string {
    return this.configService.get('HOST', 'localhost');
  }

  get port(): number {
    return this.configService.get('PORT', 3030);
  }

  get secret(): string {
    return this.configService.get('JWT_SECRET', '');
  }
  get serverHost(): string {
    return this.configService.get('SERVER_HOST', 'localhost');
  }
}
