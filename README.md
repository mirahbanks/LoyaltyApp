# DeFi-Based Loyalty Program

## Overview
This project implements a decentralized loyalty program on the Stacks blockchain using Clarity smart contracts. Users can earn tokens for their activity, redeem tokens for items, and participate in a simple token marketplace.

## Features
- SIP-010 compliant fungible token (LoyaltyToken - LTK)
- User activity tracking and token minting
- Item management (adding and redeeming items)
- Token transfer functionality for marketplace interactions

## Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) installed on your system
- Basic understanding of Clarity and Stacks blockchain concepts

## Getting Started
1. Clone the repository:
   ```
   git clone https://github.com/your-username/defi-loyalty-program.git
   cd defi-loyalty-program
   ```

2. Install dependencies:
   ```
   clarinet requirements
   ```

3. Run tests:
   ```
   clarinet test
   ```

## Smart Contract Overview
The main contract file is `contracts/loyalty-program.clar`. Key functions include:

- `earn-tokens`: Mint tokens to users based on their activity
- `add-item`: Add new items to the loyalty program
- `redeem-item`: Allow users to redeem items with their tokens
- `transfer`: Enable token transfers between users

## Testing
Test cases are located in `tests/loyalty-program_test.ts`. They cover:

- Token minting and balance checking
- Item addition and redemption
- Token transfers between users

To run tests:
```
clarinet test
```

## Deployment
To deploy the contract to the Stacks testnet or mainnet, follow these steps:

1. Configure your Stacks account in Clarinet
2. Update `Clarinet.toml` with your network settings
3. Run:
   ```
   clarinet deploy --network testnet
   ```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
