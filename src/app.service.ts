import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransferDto } from './dtos/transfer.dto';
import { Web3Service } from './providers/web3/web3.service';
import Logger, { LoggerKey } from './common/logger/logger.type';
import {
  BalanceResponse,
  EnvData,
  TransferResponse,
} from './interfaces/app.interfaces';

@Injectable()
export class AppService {
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private readonly web3Service: Web3Service,
  ) {}

  async getBalance(
    tokenContractAddr: string,
    userAddr: string,
  ): Promise<BalanceResponse> {
    try {
      const isContractErc20Standard =
        await this.web3Service.isContractErc20Standard(tokenContractAddr);
      if (!isContractErc20Standard) {
        throw new HttpException(
          'Contract is not ERC20 standard',
          HttpStatus.BAD_REQUEST,
        );
      }
      const balance_in_tokens = await this.web3Service.getTokenBalance(
        userAddr,
        tokenContractAddr,
      );
      const balance_in_eth = await this.web3Service.getBalanceEth(userAddr);
      return { balance_in_tokens, balance_in_eth };
    } catch (error) {
      this.logger.error(`Error in getBalance`, { error });
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async transfer(
    privateKey: string,
    transferDto: TransferDto,
  ): Promise<TransferResponse> {
    try {
      const transactionHash = await this.web3Service.transfer(
        privateKey,
        transferDto,
      );
      return { success: true, transactionHash };
    } catch (error) {
      this.logger.error(`Error in transfer`, { error });
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // for development only
  async mintTokensToAddress(privateKey: string): Promise<TransferResponse> {
    try {
      const transactionHash = await this.web3Service.mintTestToken(privateKey);
      return { success: true, transactionHash };
    } catch (error) {
      this.logger.error(`Error in minting`, { error });
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createEnvData(): Promise<EnvData> {
    const wallet = this.web3Service.generateTestWallet();
    return {
      PORT: 3000,
      SERVER_HOST: 'localhost',
      SERVER_WALLET_PRIVATE_KEY: wallet.privateKey,
      SERVER_WALLET_ADDRESS: wallet.address,
      RPC_URL: 'Use own rpc url',
      ERC20_CONTRACT_ADDRESS: this.web3Service.getDefaultErc20ContractAddress(),
      EXPLORER_URL: 'https://sepolia.etherscan.io/',
    };
  }
}
