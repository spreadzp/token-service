import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Web3Service } from './providers/web3/web3.service';
import { LoggerKey } from './common/logger/logger.type';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TransferDto } from './dtos/transfer.dto';

describe('AppService', () => {
    let appService: AppService;
    let web3Service: Web3Service;
    let logger: any;

    beforeEach(async () => {
        logger = {
            error: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: Web3Service,
                    useValue: {
                        isContractErc20Standard: jest.fn(),
                        getTokenBalance: jest.fn(),
                        getBalanceEth: jest.fn(),
                        transfer: jest.fn(),
                        generateTestWallet: jest.fn(),
                        getDefaultErc20ContractAddress: jest.fn(),
                    },
                },
                {
                    provide: LoggerKey,
                    useValue: logger,
                },
            ],
        }).compile();

        appService = module.get<AppService>(AppService);
        web3Service = module.get<Web3Service>(Web3Service);
    });

    describe('getBalance', () => {
        it('should return balance in tokens and ETH', async () => {
            const tokenContractAddr = '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D';
            const userAddr = '0x9FCbBc76EDD680b4073345C36a8B6880352363e8';

            (web3Service.isContractErc20Standard as jest.Mock).mockResolvedValue(
                true,
            );
            (web3Service.getTokenBalance as jest.Mock).mockResolvedValue(
                '1000000000000000000',
            );
            (web3Service.getBalanceEth as jest.Mock).mockResolvedValue(
                '50000000000000000',
            );

            const result = await appService.getBalance(tokenContractAddr, userAddr);
            expect(result).toEqual({
                balance_in_tokens: '1000000000000000000',
                balance_in_eth: '50000000000000000',
            });
        });

        it('should throw an error if the contract is not ERC20 standard', async () => {
            const tokenContractAddr = '0xInvalidAddress';
            const userAddr = '0x9FCbBc76EDD680b4073345C36a8B6880352363e8';

            (web3Service.isContractErc20Standard as jest.Mock).mockResolvedValue(
                false,
            );

            await expect(
                appService.getBalance(tokenContractAddr, userAddr),
            ).rejects.toThrow(
                new HttpException(
                    'Contract is not ERC20 standard',
                    HttpStatus.BAD_REQUEST,
                ),
            );
        });

        it('should throw an error if an exception occurs', async () => {
            const tokenContractAddr = '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D';
            const userAddr = '0x9FCbBc76EDD680b4073345C36a8B6880352363e8';

            (web3Service.isContractErc20Standard as jest.Mock).mockRejectedValue(
                new Error('Some error'),
            );

            await expect(
                appService.getBalance(tokenContractAddr, userAddr),
            ).rejects.toThrow(
                new HttpException('Some error', HttpStatus.INTERNAL_SERVER_ERROR),
            );
            expect(logger.error).toHaveBeenCalledWith('Error in getBalance', {
                error: new Error('Some error'),
            });
        });
    });

    describe('transfer', () => {
        it('should return success and transaction hash', async () => {
            const privateKey = '0x9FCbBc76EDD680b4073345C36a8B6880352363e8';
            const transferDto: TransferDto = {
                token_addr: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
                user_addr: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
                recipient_addr: '0xRecipientAddress',
                amount: 10,
            };

            (web3Service.transfer as jest.Mock).mockResolvedValue('0xabc123...');

            const result = await appService.transfer(privateKey, transferDto);
            expect(result).toEqual({
                success: true,
                transactionHash: '0xabc123...',
            });
        });

        it('should throw an error if an exception occurs', async () => {
            const privateKey = '0x9FCbBc76EDD680b4073345C36a8B6880352363e8';
            const transferDto: TransferDto = {
                token_addr: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
                user_addr: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
                recipient_addr: '0xRecipientAddress',
                amount: 10,
            };

            (web3Service.transfer as jest.Mock).mockRejectedValue(
                new Error('Transfer failed'),
            );

            await expect(
                appService.transfer(privateKey, transferDto),
            ).rejects.toThrow(
                new HttpException('Transfer failed', HttpStatus.INTERNAL_SERVER_ERROR),
            );
            expect(logger.error).toHaveBeenCalledWith('Error in transfer', {
                error: new Error('Transfer failed'),
            });
        });
    });

    describe('createEnvData', () => {
        it('should return environment data', async () => {
            const wallet = {
                privateKey: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
                address: '0x9FCbBc76EDD680b4073345C36a8B6880352363e8',
            };

            (web3Service.generateTestWallet as jest.Mock).mockReturnValue(wallet);
            (web3Service.getDefaultErc20ContractAddress as jest.Mock).mockReturnValue(
                '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
            );

            const result = await appService.createEnvData();
            expect(result).toEqual({
                PORT: 3000,
                SERVER_HOST: 'localhost',
                SERVER_WALLET_PRIVATE_KEY: wallet.privateKey,
                SERVER_WALLET_ADDRESS: wallet.address,
                RPC_URL: 'Use own rpc url',
                ERC20_CONTRACT_ADDRESS: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
            });
        });
    });
});
