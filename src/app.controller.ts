import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { TransferDto } from './dtos/transfer.dto';
import { BalanceParamsDto } from './dtos/balance-params.dto';
import { ApiSecurity, ApiTags, ApiResponse } from '@nestjs/swagger';

import { JwtAccessGuard } from './guards/private-key.guard';
import { UserKey } from './decorators/user-key.decorator';
import {
  BalanceResponseDto,
  EnvDataResponseDto,
  TransferResponseDto,
} from './dtos/app-responses.dto';

@ApiSecurity('bearerAuth')
@ApiTags('Main API')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('balance/:token_contract_addr/:user_addr')
  @UseGuards(JwtAccessGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved balance',
    type: BalanceResponseDto,
  })
  getBalance(@Param() params: BalanceParamsDto) {
    return this.appService.getBalance(
      params.token_contract_addr,
      params.user_addr,
    );
  }

  @Post('transfer')
  @UseGuards(JwtAccessGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: 200,
    description: 'Successfully performed transfer',
    type: TransferResponseDto,
  })
  transfer(@UserKey() privateKey: string, @Body() transferDto: TransferDto) {
    return this.appService.transfer(privateKey, transferDto);
  }

  @Get('createEnvData')
  @ApiResponse({
    status: 200,
    description: 'Successfully created environment data',
    type: EnvDataResponseDto,
  })
  createEnvData() {
    return this.appService.createEnvData();
  }
}
