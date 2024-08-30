To enhance your `README.md` with details about your GitHub Actions workflows and how to set them up, you can include sections that explain the purpose of each workflow, the triggers, and the required secrets and variables. Here's how you can update your `README.md`:

```markdown
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

## Installation

To get started, clone the repository and install the dependencies:

```bash
$ git clone https://github.com/your-repo/token-service-backend.git
$ cd token-service-backend
$ npm install
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

## Documentation

- **API Documentation**: Access the Swagger API documentation at [http://localhost:3000/api](http://localhost:3000/api) once the server is running.
- **Code Documentation**: Generate and serve detailed code documentation using Compodoc:

```bash
$ npm run documentation
# Access documentation at http://127.0.0.1:9999
```

![Documentation Example](https://github.com/user-attachments/assets/7a644bbb-c76b-4ab8-81e3-67d7b2f4d944)

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
- `DEV_RPC_URL`: The RPC URL for the development environment.
- `DEV_ERC20_CONTRACT_ADDRESS`: The ERC20 contract address for the development environment.
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