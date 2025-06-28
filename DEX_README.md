# KRC20 DEX - Decentralized Exchange for KasOS

## Overview

The KRC20 DEX is a comprehensive decentralized exchange application built for KasOS that enables trading of KRC20 tokens on the Kaspa blockchain. It provides a modern, user-friendly interface for spot trading, liquidity provision, and portfolio management.

## Features

### 🔄 **Spot Trading**
- Real-time order book with buy/sell orders
- Market and limit order placement
- Live price feeds and 24h change tracking
- Multiple trading pairs support (KRC20/KAS, KAS/USDT)

### 💰 **Wallet Integration**
- Seamless KasWare wallet connection
- Real-time balance updates
- Secure transaction signing
- Multi-token portfolio view

### 🏊 **Liquidity Pools**
- Add/remove liquidity from trading pairs
- LP token management
- Yield farming opportunities
- Pool statistics and APY tracking

### 📊 **Advanced Trading Interface**
- Professional order book display
- Price charts (coming soon)
- Order history and management
- Real-time market data

### 🔒 **Security & Privacy**
- Non-custodial trading
- Client-side order management
- Secure smart contract interactions
- No KYC requirements

## Getting Started

### Prerequisites

1. **KasWare Wallet**: Install from [kasware.xyz](https://kasware.xyz)
2. **Funded Wallet**: Have KAS and KRC20 tokens for trading
3. **Internet Connection**: For blockchain interactions

### Launching the DEX

1. **From Desktop**: Click the DEX icon (🔄) on the KasOS desktop
2. **From Start Menu**: Navigate to Communication & AI → KRC20 DEX
3. **Keyboard Shortcut**: Use the KasOS app launcher

### Using the DEX

#### 1. **Connect Your Wallet**
- Click "Connect Wallet" in the top-right corner
- Authorize the connection in your KasWare extension
- Your balance and available tokens will be displayed

#### 2. **Select Trading Pair**
- Choose from available trading pairs in the dropdown
- Current supported pairs:
  - KTEST/KAS
  - KMEME/KAS
  - KAS/USDT

#### 3. **Place Orders**

**Buy Orders:**
- Enter the amount you want to buy
- Set your desired price (or use market price)
- Review the total cost
- Click "Place Buy Order"

**Sell Orders:**
- Enter the amount you want to sell
- Set your desired price
- Review the total value
- Click "Place Sell Order"

#### 4. **Manage Liquidity**

**Add Liquidity:**
- Select the token pair
- Enter amounts for both tokens
- Confirm the transaction
- Receive LP tokens representing your share

**Remove Liquidity:**
- Enter the amount of LP tokens to burn
- Confirm the transaction
- Receive your proportional share of both tokens

## Technical Architecture

### Smart Contract Integration
The DEX integrates with KRC20 token contracts and automated market maker (AMM) protocols on the Kaspa blockchain.

### Order Management
- Client-side order validation
- Blockchain-based order settlement
- Real-time order book updates

### Liquidity Pools
- Constant product market maker (x*y=k)
- Dynamic fee structure
- Impermanent loss protection mechanisms

## Trading Pairs

### Currently Supported
- **KTEST/KAS**: Test token for development
- **KMEME/KAS**: Community meme token
- **KAS/USDT**: Kaspa to stablecoin pair

### Coming Soon
- Additional KRC20 tokens
- Cross-chain bridges
- Synthetic assets

## Security Features

### Non-Custodial Design
- Users maintain control of their private keys
- No deposits required to centralized exchange
- Direct wallet-to-wallet transactions

### Smart Contract Security
- Audited smart contracts
- Multi-signature governance
- Timelock mechanisms for upgrades

### Risk Management
- Slippage protection
- Front-running prevention
- MEV (Maximal Extractable Value) mitigation

## Fee Structure

### Trading Fees
- **Spot Trading**: 0.3% per transaction
- **Liquidity Provision**: 0.25% trading fee share
- **Network Fees**: Standard Kaspa transaction fees

### Fee Distribution
- 0.25% to liquidity providers
- 0.05% to protocol development
- Network fees to Kaspa miners

## API Reference

### Wallet Integration
```javascript
// Connect wallet
await window.kasware.requestAccounts();

// Get balance
const balance = await window.kasware.getBalance();

// Get KRC20 tokens
const tokens = await window.kasware.getKRC20Balance();
```

### Order Placement
```javascript
// Place buy order
const buyOrder = {
    type: 'buy',
    pair: 'KTEST/KAS',
    amount: 1000,
    price: 0.00001234
};

// Place sell order
const sellOrder = {
    type: 'sell',
    pair: 'KTEST/KAS',
    amount: 500,
    price: 0.00001456
};
```

### Liquidity Operations
```javascript
// Add liquidity
const addLiquidity = {
    tokenA: 'KTEST',
    tokenB: 'KAS',
    amountA: 1000,
    amountB: 100
};

// Remove liquidity
const removeLiquidity = {
    lpTokens: 50.5
};
```

## Development

### Local Development
1. Ensure KasOS is running
2. Load the DEX application
3. Connect to testnet for testing

### Testing
- Use testnet tokens for development
- Test all trading scenarios
- Verify wallet integration

### Contributing
1. Fork the repository
2. Create a feature branch
3. Test thoroughly
4. Submit a pull request

## Troubleshooting

### Common Issues

**Wallet Connection Failed**
- Ensure KasWare extension is installed and enabled
- Check if wallet is unlocked
- Verify network settings

**Transaction Failed**
- Check if you have sufficient balance
- Verify network fees are covered
- Ensure token approval is set

**Order Not Executing**
- Check if order price is competitive
- Verify sufficient liquidity exists
- Confirm order parameters are correct

### Support

For technical support and bug reports:
1. Check the error console in browser
2. Review transaction history in wallet
3. Contact development team with details

## Roadmap

### Version 1.1
- [ ] Advanced charting with TradingView integration
- [ ] Stop-loss and take-profit orders
- [ ] Portfolio analytics dashboard

### Version 1.2
- [ ] Cross-chain token bridges
- [ ] Yield farming protocols
- [ ] DAO governance token

### Version 2.0
- [ ] Mobile responsive design
- [ ] Advanced trading features
- [ ] Institutional trading tools

## Security Considerations

### Best Practices
1. **Never share private keys or seed phrases**
2. **Verify contract addresses before trading**
3. **Start with small amounts for testing**
4. **Keep your wallet software updated**

### Risk Disclosure
- Cryptocurrency trading involves risk of loss
- Smart contracts may contain bugs
- Market volatility can result in significant losses
- Only trade with funds you can afford to lose

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Kaspa blockchain development team
- KasWare wallet developers
- KasOS platform contributors
- Open-source DEX projects for inspiration

---

**Disclaimer**: This is experimental software. Use at your own risk. Always verify transactions and contract interactions before confirming.
