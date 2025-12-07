# 🌟 BlockFund - Web3 Crowdfunding DApp

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React](https://img.shields.io/badge/React-18-blue) ![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.9-lightgrey) ![Thirdweb](https://img.shields.io/badge/Thirdweb-SDK-f213c4)

A decentralized crowdfunding platform built on the Ethereum blockchain. BlockFund allows creators to launch campaigns, raise funds with escrow security, and enables backers to support projects with confidence, featuring automated refunds and secure withdrawals.

![BlockFund Preview](https://via.placeholder.com/1200x600.png?text=Campaign+Dashboard+Preview)

## ✨ Key Features

- **🚀 Create Campaigns**: Easily publish crowdfunding campaigns with a target amount, deadline, and rich media.
- **💸 Secure Donations**: Backers contribute Ethereum directly to the smart contract logic.
- **🔒 Escrow & Security**: Funds are held securely. Creators can only withdraw once the funding target is met.
- **↩️ Automated Refunds**: If a campaign fails to meet its target by the deadline, backers can claim a full refund.
- **📊 Creator Dashboard**: Real-time tracking of campaign progress and fund withdrawal status.
- **📜 Contribution History**: Users can view their donation history and status across all campaigns.
- **🌗 Dark/Light Mode**: A beautiful, responsive UI with theme toggling.

## 🛠️ Tech Stack

**Frontend:**
- **React** (Vite)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Thirdweb SDK** (Web3 Interaction)
- **Ethers.js** (Blockchain Utilities)

**Smart Contract:**
- **Solidity**
- **Hardhat** (Development Environment)
- **Thirdweb Deploy**

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MetaMask Wallet
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/crowdfunding-dapp.git
cd crowdfunding-dapp
```

### 2. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

Start the development server:
```bash
npm run dev
```
The application will run at `http://localhost:5173`.

### 3. Smart Contract (Optional)
If you wish to deploy your own version of the contract:
```bash
cd web3
npm install
npx thirdweb deploy
```

## 📖 Usage Guide

1.  **Connect Wallet**: Click the "Connect" button to link your MetaMask wallet.
2.  **Create Campaign**: Go to the "Campaign" tab, fill in the details (Title, Story, Target, Deadline), and publish.
3.  **Donate**: Browse campaigns on the dashboard, select one, and donate ETH.
4.  **Withdraw**: If you are a creator and your campaign hits the target, go to the **Withdraw** icon to claim funds.
5.  **Refund**: If a campaign you backed expires without reaching its goal, go to **Payment** history to claim your refund.
6.  **Logout**: Use the logout button in the sidebar to disconnect.

## 🤝 Contributing

Contributions are welcome!
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with 💜 by [Your Name]
