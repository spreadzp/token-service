import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import * as morgan from 'morgan';

import Logger, { LoggerBaseKey, LoggerKey } from './logger.type';
import WinstonLogger, {
  WinstonLoggerTransportsKey,
} from './winston/winston.logger';
import LoggerService from './logger.service';
import NestjsLoggerServiceAdapter from './logger.adapter';
import ConsoleTransport from './winston/transports/console.transport';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: NestjsLoggerServiceAdapter,
      useFactory: (logger: Logger) => new NestjsLoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },

    {
      provide: WinstonLoggerTransportsKey,
      useFactory: () => {
        const transports = [];
        transports.push(ConsoleTransport.createColorize());
        //Add new transport types here
        return transports;
      },
    },
  ],
  exports: [LoggerKey, NestjsLoggerServiceAdapter],
})
export class LoggerModule implements NestModule {
  public constructor(@Inject(LoggerKey) private logger: Logger) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan('combined', {
          stream: {
            write: (message: string) => {
              this.logger.debug(message, {
                sourceClass: 'RequestLogger',
              });
            },
          },
        }),
      )
      .forRoutes('*');
  }
}
