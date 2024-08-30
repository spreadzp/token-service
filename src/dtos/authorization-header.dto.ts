import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthorizationHeaderDto {
  @ApiProperty({
    description: 'Authorization header with Bearer token',
    example: 'Bearer 0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
  })
  @IsString()
  @Matches(/^Bearer\s[a-fA-F0-9]+$/, {
    message:
      'Authorization header must be in the format "Bearer <private_key>"',
  })
  authorization: string;
}
