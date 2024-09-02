import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Web3Config {
  constructor(private configService: ConfigService) {}

  get getRpc(): string {
    return this.configService.get('RPC_URL', process.env.RPC_URL);
  }

  get getServerWalletPrivateKey(): string {
    return this.configService.get(
      'SERVER_WALLET_PRIVATE_KEY',
      process.env.SERVER_WALLET_PRIVATE_KEY,
    );
  }

  get getServerWalletAddress(): string {
    return this.configService.get(
      'SERVER_WALLET_ADDRESS',
      process.env.SERVER_WALLET_ADDRESS,
    );
  }

  get getErc20ContractAddress(): string {
    return this.configService.get(
      'ERC20_CONTRACT_ADDRESS',
      process.env.ERC20_CONTRACT_ADDRESS,
    );
  }
  getExplorerUrl(): string {
    return this.configService.get('EXPLORER_URL', process.env.EXPLORER_URL);
  }
}
