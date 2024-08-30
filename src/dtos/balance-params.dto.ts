import { IsString, IsEthereumAddress, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BalanceParamsDto {
  @ApiProperty({
    description: 'Token contract address',
    example: '0x5351baDec2bc03C27727d537Ca36820402075a51',
  })
  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  token_contract_addr: string;

  @ApiProperty({
    description: 'User wallet address',
    example: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
  })
  @IsString()
  @IsEthereumAddress()
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  user_addr: string;
}
