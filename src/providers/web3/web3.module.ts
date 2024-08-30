import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { Web3Config } from './../../config/server-config/web3-config.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [Web3Service, Web3Config, ConfigService],
  exports: [Web3Service],
})
export class Web3Module {}
