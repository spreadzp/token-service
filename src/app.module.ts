import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { ServerConfigModule } from './config/server-config/server-config.module';
import { HealthModule } from './common/health/health.module';
import { Web3Module } from './providers/web3/web3.module';

@Module({
  imports: [LoggerModule, ServerConfigModule, HealthModule, Web3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
