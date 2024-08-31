import Logger, { LoggerKey } from '../../common/logger/logger.type';
import { Web3Config } from './../../config/server-config/web3-config.service';

import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ethers, Wallet } from 'ethers';
import { ERC20_ABI } from './abis';
import { TransferDto } from '@dtos/transfer.dto';
@Injectable()
export class Web3Service implements OnModuleInit {
  private provider: ethers.AbstractProvider;
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    private readonly web3Config: Web3Config,
  ) {}

  onModuleInit() {
    this.connectProvider();
  }

  async connectProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(this.web3Config.getRpc);
    } catch (err) {
      this.logger.error('connectProvider', err);
    }
  }
  async getBalanceEth(userWalletAddress: string): Promise<string> {
    const balance = await this.provider.getBalance(userWalletAddress);
    return ethers.formatEther(balance);
  }

  async getTokenBalance(
    userWalletAddress: string,
    erc20TokenContractAddress: string,
  ): Promise<string> {
    const erc20Contract = new ethers.Contract(
      erc20TokenContractAddress,
      ERC20_ABI.abi,
      this.provider,
    );
    const balance = await erc20Contract.balanceOf(userWalletAddress);
    return ethers.formatUnits(balance, await erc20Contract.decimals());
  }

  async isContractErc20Standard(contractAddress: string): Promise<boolean> {
    const erc20Contract = new ethers.Contract(
      contractAddress,
      ERC20_ABI.abi,
      this.provider,
    );
    try {
      await Promise.all([
        erc20Contract.name(),
        erc20Contract.symbol(),
        erc20Contract.decimals(),
        erc20Contract.totalSupply(),
      ]);
      return true;
    } catch (error) {
      return false;
    }
  }

  async mintTestToken(userPrivateKey: string): Promise<string> {
    const userWallet = this.createWalletByPrivateKey(userPrivateKey);
    const erc20Contract = new ethers.Contract(
      this.web3Config.getErc20ContractAddress,
      ERC20_ABI.abi,
      userWallet,
    );
    const tx = await erc20Contract.mint();
    const receipt = await tx.wait();

    return receipt.hash;
  }

  async transfer(
    userPrivateKey: string,
    transferDto: TransferDto,
  ): Promise<string> {
    try {
      const userWallet = this.createWalletByPrivateKey(userPrivateKey);

      const erc20Contract = new ethers.Contract(
        transferDto.token_addr,
        ERC20_ABI.abi,
        userWallet,
      );

      const amount = BigInt(10);

      const balanceBigNumber = await erc20Contract.balanceOf(
        userWallet.address,
      );

      if (balanceBigNumber < amount) {
        throw new Error('Insufficient token balance');
      }

      const feeData = await this.provider.getFeeData();

      const tx = await erc20Contract.transfer(
        transferDto.recipient_addr,
        amount,
        {
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
          maxFeePerGas: feeData.maxFeePerGas,
          gasLimit: 50_000,
        },
      );

      const receipt = await tx.wait();

      return receipt.hash;
    } catch (error) {
      this.logger.error('transfer', error);
      throw new Error(`Error in transfer: ${error.message}`);
    }
  }

  async saveNewErc20ToWhiteList(contractAddress: string): Promise<void> {
    if (await this.isContractErc20Standard(contractAddress)) {
      // Save to whitelist logic here
      console.log(`Contract ${contractAddress} saved to whitelist`);
    } else {
      throw new HttpException(
        'Contract is not ERC20 standard',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  generateTestWallet(): any {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase,
    };
  }
  getDefaultErc20ContractAddress(): string {
    return this.web3Config.getErc20ContractAddress;
  }

  private createWalletByPrivateKey(privateKey: string): Wallet {
    return new Wallet(privateKey, this.provider);
  }
}
