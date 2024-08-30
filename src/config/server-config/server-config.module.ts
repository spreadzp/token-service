import { Module, OnModuleInit } from '@nestjs/common';
import { ServerConfig } from './server-config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ expandVariables: true })],
  providers: [ServerConfig],
  exports: [ServerConfig],
})
export class ServerConfigModule implements OnModuleInit {
  constructor(private serverConfig: ServerConfig) {}

  private validateConfig(config: any): void {
    const prototype = Object.getPrototypeOf(config);
    const gettersKeys: string[] = [];

    Object.getOwnPropertyNames(prototype).forEach((name) => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
      if (descriptor && typeof descriptor.get === 'function') {
        gettersKeys.push(name);
      }
    });

    for (const getterKey of gettersKeys) {
      config[getterKey];
    }
  }

  onModuleInit() {
    this.validateConfig(this.serverConfig);
  }
}
