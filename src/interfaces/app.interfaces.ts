export interface BalanceResponse {
  balance_in_tokens: string;
  balance_in_eth: string;
}

export interface TransferResponse {
  success: boolean;
  transactionHash: string;
}

export interface EnvData {
  PORT: number;
  SERVER_HOST: string;
  SERVER_WALLET_PRIVATE_KEY: string;
  SERVER_WALLET_ADDRESS: string;
  RPC_URL: string;
  ERC20_CONTRACT_ADDRESS: string;
  EXPLORER_URL: string;
}
