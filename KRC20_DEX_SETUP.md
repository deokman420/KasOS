# KRC20 DEX Quick Setup Guide

## Prerequisites
1. **KasWare Wallet Extension** - Install from the official Kaspa website
2. **Modern Web Browser** - Chrome, Firefox, Safari, or Edge
3. **KAS Tokens** - For trading and paying fees
4. **KRC20 Tokens** - Any supported tokens for trading

## Installation & Launch

### Option 1: Local Development
```bash
# Clone or download the WebOS project
cd webos_2

# Start a local web server
python -m http.server 8000
# OR
npx serve .
# OR
php -S localhost:8000

# Open in browser
http://localhost:8000
```

### Option 2: Direct File Access
1. Download the WebOS files
2. Open `index.html` in your browser
3. Navigate to the KRC20 DEX application

## First Time Setup

### 1. Connect Your Wallet
- Click the "Connect Wallet" button in the DEX header
- Approve the connection in your KasWare wallet
- Verify your address is displayed

### 2. Check Token Balances
- View your KAS and KRC20 token balances in the right panel
- Ensure you have sufficient tokens for trading
- Note the minimum amounts for trading

### 3. Select Trading Pair
- Choose from available pairs: KTEST/KAS, KMEME/KAS, etc.
- Review current price and 24h statistics
- Check liquidity levels for your chosen pair

## Making Your First Trade

### Market Order (Instant)
1. Select "Market Order" type
2. Enter the amount you want to trade
3. Review slippage tolerance (default 0.5%)
4. Click "Place Buy Order" or "Place Sell Order"
5. Confirm transaction in your wallet

### Limit Order (Specific Price)
1. Select "Limit Order" type
2. Enter amount and desired price
3. Review total including fees
4. Place order and wait for execution

## Adding Liquidity

### Provide Liquidity to Earn Fees
1. Navigate to the "Liquidity Pool" section
2. Select "Add Liquidity" tab
3. Enter amounts for both tokens in the pair
4. Confirm the transaction
5. Receive LP tokens representing your share

### Remove Liquidity
1. Go to "Remove Liquidity" tab
2. Enter LP token amount to withdraw
3. Confirm to receive underlying tokens plus earned fees

## Understanding Fees

### Trading Fees
- **0.25%** fee on all trades
- Paid in the quote token (usually KAS)
- Used to reward liquidity providers

### Network Fees
- Standard Kaspa network fees
- Variable based on network congestion
- Typically very low (< 0.01 KAS)

## Safety Tips

### Before Trading
✅ **Verify token addresses** - Only trade verified KRC20 tokens  
✅ **Start with small amounts** - Test the interface first  
✅ **Check slippage** - Set appropriate tolerance for market conditions  
✅ **Review orders** - Double-check all details before confirming  

### Security Best Practices
🔒 **Never share private keys** - KasWare handles all signing  
🔒 **Use official websites only** - Avoid phishing sites  
🔒 **Keep wallet updated** - Install latest KasWare version  
🔒 **Verify transactions** - Check all details before approval  

## Troubleshooting

### Common Issues

**Wallet Won't Connect**
- Ensure KasWare extension is installed and unlocked
- Refresh the page and try again
- Check browser permissions for the extension

**Transaction Fails**
- Verify sufficient token balance including fees
- Check network connectivity
- Increase slippage tolerance for volatile markets

**Orders Not Filling**
- Limit orders may take time in low-liquidity markets
- Consider using market orders for immediate execution
- Check if your price is within market range

**Balance Not Updating**
- Click the refresh button in the orders section
- Wallet balances update automatically every few seconds
- Manually refresh if needed

### Getting Help

**Discord Community**: Join the Kaspa Discord for real-time support  
**Documentation**: Read the full KRC20_DEX_README.md  
**GitHub Issues**: Report bugs and feature requests  
**FAQ**: Check common questions in the docs  

## Advanced Features

### Chart Analysis
- Switch between 1H, 4H, 1D, 1W timeframes
- Analyze price trends and trading patterns
- Use for better entry/exit timing

### Order Book Trading
- View real-time buy/sell orders
- Click on prices to auto-fill your order
- Monitor market depth and liquidity

### Portfolio Management
- Track all your open orders
- Review complete trading history
- Monitor profit/loss over time

## Next Steps

Once you're comfortable with basic trading:

1. **Explore Advanced Orders** - Try stop orders for risk management
2. **Provide Liquidity** - Earn fees by adding to liquidity pools
3. **Join the Community** - Connect with other traders
4. **Stay Updated** - Follow development updates and new features

---

**Happy Trading! 🚀**

*Remember: Only trade what you can afford to lose. Cryptocurrency trading involves significant risk.*
