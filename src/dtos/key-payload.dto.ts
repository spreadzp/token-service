import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString } from 'class-validator';

export class KeyPayloadDto {
  @ApiProperty({
    description: 'User wallet private key',
    example: '0x5351baDec2bc03C27727d537Ca36820402075a51',
  })
  @IsString()
  @IsEthereumAddress()
  key: string;
}
