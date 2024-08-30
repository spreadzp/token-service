import { Test, TestingModule } from '@nestjs/testing';
import { Web3Service } from './web3.service';
import { LoggerKey } from '../../common/logger/logger.type';
import { Web3Config } from '../../config/server-config/web3-config.service';
import { ethers } from 'ethers';
import { TransferDto } from '@dtos/transfer.dto';
import { ConfigService } from '@nestjs/config';

describe('Web3Service', () => {
  let service: Web3Service;
  let mockLogger: any;
  let mockConfigService: any;
  let mockProvider: any;
  let mockErc20Contract: any;

  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn((key) => {
        switch (key) {
          case 'RPC_URL':
            return 'http://localhost:8545';
          case 'SERVER_WALLET_PRIVATE_KEY':
            return '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
          case 'SERVER_WALLET_ADDRESS':
            return '0x0000000000000000000000000000000000000000';
          case 'ERC20_CONTRACT_ADDRESS':
            return '0x0000000000000000000000000000000000000000';
          default:
            return undefined;
        }
      }),
    };

    mockProvider = {
      getBalance: jest.fn().mockResolvedValue(ethers.parseEther('1')),
      getFeeData: jest.fn().mockResolvedValue({
        maxPriorityFeePerGas: ethers.parseUnits('2.5', 'gwei'),
        maxFeePerGas: ethers.parseUnits('2.5', 'gwei'),
      }),
    };

    mockErc20Contract = {
      decimals: jest.fn().mockResolvedValue(18),
      transfer: jest.fn().mockResolvedValue({
        wait: jest.fn().mockResolvedValue({
          hash: '0x1234567890abcdef',
        }),
      }),
      balanceOf: jest.fn().mockResolvedValue(ethers.parseUnits('100', 18)),
    };

    jest.spyOn(ethers, 'Contract').mockImplementation(() => mockErc20Contract);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Web3Service,
        { provide: LoggerKey, useValue: mockLogger },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ethers.JsonRpcProvider, useValue: mockProvider },
        Web3Config,
      ],
    }).compile();

    service = module.get<Web3Service>(Web3Service);

    // Manually set the provider to the mock provider
    (service as any).provider = mockProvider;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get balance in ETH', async () => {
    const userWalletAddress = '0x0000000000000000000000000000000000000000';
    const balance = await service.getBalanceEth(userWalletAddress);
    expect(balance).toBe('1.0');
  });

  it('should transfer tokens successfully', async () => {
    const userPrivateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const transferDto: TransferDto = {
      user_addr: '0x0000000000000000000000000000000000000000',
      token_addr: '0x0000000000000000000000000000000000000000',
      recipient_addr: '0x0000000000000000000000000000000000000000',
      amount: 1,
    };

    const txHash = await service.transfer(userPrivateKey, transferDto);
    expect(txHash).toBe('0x1234567890abcdef');
  });

  it('should handle insufficient balance', async () => {
    const userPrivateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const transferDto: TransferDto = {
      user_addr: '0x0000000000000000000000000000000000000000',
      token_addr: '0x0000000000000000000000000000000000000000',
      recipient_addr: '0x0000000000000000000000000000000000000000',
      amount: 1000000, // Assuming this amount is too large for the balance
    };

    mockErc20Contract.balanceOf = jest
      .fn()
      .mockResolvedValue(ethers.parseUnits('0', 18));

    await expect(service.transfer(userPrivateKey, transferDto)).rejects.toThrow(
      'Insufficient token balance',
    );
  });

  it('should handle invalid private key', async () => {
    const invalidPrivateKey = 'invalid_private_key';
    const transferDto: TransferDto = {
      user_addr: '0x0000000000000000000000000000000000000000',
      token_addr: '0x0000000000000000000000000000000000000000',
      recipient_addr: '0x0000000000000000000000000000000000000000',
      amount: 1,
    };

    await expect(
      service.transfer(invalidPrivateKey, transferDto),
    ).rejects.toThrow();
  });

  it('should handle invalid token address', async () => {
    const userPrivateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const transferDto: TransferDto = {
      user_addr: '0x0000000000000000000000000000000000000000',
      token_addr: 'invalid_token_address',
      recipient_addr: '0x0000000000000000000000000000000000000000',
      amount: 1,
    };

    jest.spyOn(ethers, 'Contract').mockImplementation(() => {
      throw new Error('Invalid token address');
    });

    await expect(service.transfer(userPrivateKey, transferDto)).rejects.toThrow(
      'Invalid token address',
    );
  });

  it('should handle invalid recipient address', async () => {
    const userPrivateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const transferDto: TransferDto = {
      user_addr: '0x0000000000000000000000000000000000000000',
      token_addr: '0x0000000000000000000000000000000000000000',
      recipient_addr: 'invalid_recipient_address',
      amount: 1,
    };

    mockErc20Contract.transfer = jest
      .fn()
      .mockRejectedValue(new Error('Invalid recipient address'));

    await expect(service.transfer(userPrivateKey, transferDto)).rejects.toThrow(
      'Invalid recipient address',
    );
  });
});
