import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty({
    example: '0.000125',
    description: 'Balance in tokens (in wei)',
  })
  balance_in_tokens: string;

  @ApiProperty({
    example: '0.00012578',
    description: 'Balance in ETH (in wei)',
  })
  balance_in_eth: string;
}

export class TransferResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates if the transfer was successful',
  })
  success: boolean;

  @ApiProperty({
    example: 'https://sepolia.etherscan.io/tx/0xabc123...',
    description: 'Transaction hash of the transfer',
  })
  transactionHash: string;
}

export class EnvDataResponseDto {
  @ApiProperty({
    example: 3000,
    description: 'Port number the server is running on',
  })
  PORT: number;

  @ApiProperty({ example: 'localhost', description: 'Host name of the server' })
  SERVER_HOST: string;

  @ApiProperty({
    example: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
    description: 'Private key of the server wallet',
  })
  SERVER_WALLET_PRIVATE_KEY: string;

  @ApiProperty({
    example: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
    description: 'Address of the server wallet',
  })
  SERVER_WALLET_ADDRESS: string;

  @ApiProperty({
    example: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    description: 'RPC URL used by the server',
  })
  RPC_URL: string;

  @ApiProperty({
    example: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
    description: 'Default ERC20 contract address',
  })
  ERC20_CONTRACT_ADDRESS: string;

  @ApiProperty({
    example: 'https://sepolia.etherscan.io/',
    description: 'Explorer URL used by the server',
  })
  EXPLORER_URL: string;
}
