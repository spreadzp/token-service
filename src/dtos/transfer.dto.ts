import { IsString, IsNumber, IsEthereumAddress } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({
    description: 'Token contract address',
    example: '0x5351baDec2bc03C27727d537Ca36820402075a51',
  })
  @IsString()
  @IsEthereumAddress()
  token_addr: string;

  @ApiProperty({
    description: `Sender\'s wallet address`,
    example: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
  })
  @IsString()
  @IsEthereumAddress()
  user_addr: string;

  @ApiProperty({
    description: `Recipient\'s wallet address`,
    example: '0x08DbDEfDC3374C0242523575Ed2Bf100A7f441Fe',
  })
  @IsString()
  @IsEthereumAddress()
  recipient_addr: string;

  @ApiProperty({
    description: 'Amount of tokens to transfer',
    example: 10,
  })
  @IsNumber()
  amount: number;
}
