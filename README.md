# Token Service Backend 
## Overview

Welcome to the Token Service Backend, a robust and scalable solution built on the [NestJS](https://nestjs.com/) framework. This backend service is designed to handle token-based operations with efficiency and security, making it an ideal choice for modern web applications.

## Features

- **TypeScript Powered**: Leveraging the power of TypeScript for static type checking and enhanced developer productivity.
- **NestJS Framework**: Utilizing NestJS for a structured, modular, and testable architecture.
- **Comprehensive Documentation**: Includes Compodoc for code documentation and Swagger for API documentation.
- **Testing**: Integrated testing capabilities with Jest for unit testing and coverage reports.
- **Production-Ready**: Optimized for production with a dedicated command for production mode.
- **Automated Deployment**: Automated Docker Compose deployment using GitHub Actions for seamless updates.

- **Uses chain**  [Get Sepolia ETH in faucet](https://faucet.chainstack.com/sepolia-testnet-faucet)
- **Deployed ERC20_CONTRACT_ADDRESS**  in [To see it in Sepolia explorer](https://sepolia.etherscan.io/address/0x5351badec2bc03c27727d537ca36820402075a51)

## Installation

To get started, clone the repository and install the dependencies:

```bash
$ git clone https://github.com/your-repo/token-service-backend.git
$ cd token-service-backend
$ npm install
$ cp .env.example .env
```

## Running the Application

Choose the appropriate command based on your development needs:

```bash
# Development mode
$ npm run start

# Watch mode for development
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Testing

Ensure the reliability and stability of the application with integrated testing:

```bash
# Run unit tests
$ npm run test

# Generate test coverage report
$ npm run test:cov
```
## Testing in swagger API on http://localhost:3000/api
Use  NFT contract 
```bash
# 1 Call  http://localhost:3000/createEnvData to get new Wallet data
# If it need to get ETH to your wallet in Sepolia chain go to faucet
```
[**Get Sepolia ETH in faucet ->**](https://faucet.chainstack.com/sepolia-testnet-faucet)
```bash
# 2 Setup private key to header 
```
[**To see here how to do it ->**](https://github.com/user-attachments/assets/949b2623-6e56-4e8c-98a7-ff5e01d9741d)
```bash
# 3 Mint test tokens in contract 0x5351baDec2bc03C27727d537Ca36820402075a51 to your wallet by call
$ http://localhost:3000/mintTokensToAddress

# 4 Test balance on deployed for testing  ERC-20  contract in http://localhost:3000/balance/  
$ 0x5351baDec2bc03C27727d537Ca36820402075a51

# Use NFT contract to test throw in http://localhost:3000/balance/
$ 0xcee736355e78407a3EADF4206A927CD4C1C5c9F1

# 5 Test transfer tokens use in Swagger UI 
$ http://localhost:3000/transfer

```

## Documentation

- **API Documentation**: Access the Swagger API documentation at [http://localhost:3000/api](http://localhost:3000/api) once the server is running.
- **Code Documentation**: Generate and serve detailed code documentation using [Compodoc](https://compodoc.app/):

```bash
$ npm run documentation
# Access documentation at http://127.0.0.1:9999
```

![Documentation Example](https://github.com/user-attachments/assets/7a644bbb-c76b-4ab8-81e3-67d7b2f4d944)

## REST API

### Endpoints

### Setup user private key to Bearer token:


#### 1. `/balance/:token_contract_addr/:user_addr` (GET)

- **Description**: Retrieves the balance of tokens and ETH for a given user address and token contract address.
- **Parameters**:
  - `token_contract_addr`: The address of the ERC20 token contract.
  - `user_addr`: The address of the user whose balance is to be retrieved.
- **Response**:
  - `200 OK`: Returns the balance in tokens and ETH.
    ```json
    {
      "balance_in_tokens": "0.000258",
      "balance_in_eth": "0.00258"
    }
    ```

#### 2. `/transfer` (POST)

- **Description**: Transfers a specified amount of tokens from a user's address to a recipient's address.
- **Request Body**:
  - `token_addr`: The address of the ERC20 token contract.
  - `user_addr`: The address of the user initiating the transfer.
  - `recipient_addr`: The address of the recipient.
  - `amount`: The amount of tokens to transfer.
- **Response**:
  - `200 OK`: Returns the transaction hash if the transfer is successful.
    ```json
    {
      "success": true,
      "transactionHash": "0xabc123..."
    }
    ```

#### 3. `/mintTokensToAddress` (POST)

- **Description**: Mints a specified amount of test tokens to a given address using a private key stored in the server configuration.
- **Request Body**:
  - `walletAddress`: The address to which the tokens will be minted.
  - `amount`: The amount of tokens to mint.
- **Response**:
  - `200 OK`: Returns the transaction hash if the minting is successful.
    ```json
    {
      "success": true,
      "transactionHash": "0xdef456..."
    }
    ```

#### 4. `/createEnvData` (GET)

- **Description**: Retrieves the environment data configured for the server.
- **Response**:
  - `200 OK`: Returns the environment data.
    ```json
    {
      "PORT": 3000,
      "SERVER_HOST": "localhost",
      "SERVER_WALLET_PRIVATE_KEY": "0x9FCbBc76EDD680b4073345C36a8B6880352363e8",
      "SERVER_WALLET_ADDRESS": "0x9FCbBc76EDD680b4073345C36a8B6880352363e8",
      "RPC_URL": "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
      "ERC20_CONTRACT_ADDRESS": "0x2859e4544C4bB03966803b044A93563Bd2D0DD4D"
    }
    ```

#### 5. `/health` (GET)

- **Description**: Checks the health status of the API server.
- **Response**:
  - `200 OK`: Returns the health check result.
    ```json
    {
      "status": "up",
      "info": {
        "apiServer": {
          "status": "up"
        }
      },
      "error": {},
      "details": {
        "apiServer": {
          "status": "up"
        }
      }
    }
    ```

## Automated Deployment with GitHub Actions

This project leverages GitHub Actions to automate the deployment and build processes. Two main workflows are defined:

### 1. Deployment Workflow (`build_deploy.yaml`)

This workflow is triggered manually or on pushes to the `dev` branch, excluding changes to GitHub workflow files. It performs the following steps:

- **Checkout Code**: Retrieves the latest code from the repository.
- **Build Docker Image**: Builds a Docker image tagged with the repository name and the first four characters of the commit SHA.
- **Save Docker Image**: Saves the Docker image to a tar file.
- **Copy Image to EC2**: Copies the Docker image to an EC2 instance using SSH.
- **Start Image on EC2**: Loads the Docker image on the EC2 instance, stops the existing container, runs the new container, and cleans up old images.

#### Required Secrets and Variables

- `DEV_NAME_IP_HOST`: The hostname or IP address of the development server.
- `DEV_SSH_KEY`: The SSH key for accessing the development server.
- `DEV_SERVER_WALLET_PRIVATE_KEY`: The private key for the server wallet.
- `DEV_SERVER_WALLET_ADDRESS`: The address of the server wallet.
- `DEV_RPC_URL`: The RPC URL for the development environment in Sepolia testnet.
- `DEV_ERC20_CONTRACT_ADDRESS`: The ERC20 contract address for the development environment in Sepolia testnet.
- `PORT`: The port number for the server.
- `SERVER_HOST`: The server host.

### 2. Build Check Workflow (`build_only.yaml`)

This workflow is triggered manually or on pushes to branches other than `dev` and `master`, excluding changes to GitHub workflow files. It performs the following steps:

- **Checkout Code**: Retrieves the latest code from the repository.
- **Build Docker Image**: Builds a Docker image tagged with the repository name and the full commit SHA.

## Contact

For any inquiries or collaboration opportunities, feel free to reach out to the author:

- **Author**: Paul Spread
- **LinkedIn**: [Paul Spread](https://www.linkedin.com/in/paul-spread-bb337b63/)

## License

This project is [MIT licensed](LICENSE), offering flexibility and openness for contributions and usage.

---

Thank you for considering the Token Service Backend for your project. We look forward to seeing how this robust backend solution enhances your application's capabilities.