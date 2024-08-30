// Interface for the balance response
export interface BalanceResponse {
  balance_in_tokens: string; // Assuming the balance is a string in wei
  balance_in_eth: string; // Assuming the balance is a string in wei
}

// Interface for the transfer response
export interface TransferResponse {
  success: boolean;
  transactionHash: string;
}

// Interface for the environment data response
export interface EnvData {
  PORT: number;
  SERVER_HOST: string;
  SERVER_WALLET_PRIVATE_KEY: string;
  SERVER_WALLET_ADDRESS: string;
  RPC_URL: string;
  ERC20_CONTRACT_ADDRESS: string;
}
