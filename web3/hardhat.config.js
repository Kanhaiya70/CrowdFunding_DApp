// require("@matterlabs/hardhat-zksync-solc");
// require("@matterlabs/hardhat-zksync-verify");


// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   zksolc: {
//     version: "1.4.1",
//     compilerSource: "binary",
//     settings: {
//       optimizer: {
//         enabled: true,
//       },
//     },
//   },
//   networks: {
//     zkSyncSepoliaTestnet: {
//       url: "https://sepolia.era.zksync.dev",
//       ethNetwork: "sepolia",
//       zksync: true,
//       chainId: 300,
//       verifyURL:
//         "https://explorer.sepolia.era.zksync.dev/contract_verification",
//     },
//     zkSyncMainnet: {
//       url: "https://mainnet.era.zksync.io",
//       ethNetwork: "mainnet",
//       zksync: true,
//       chainId: 324,
//       verifyURL:
//         "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
//     },
//   },
//   paths: {
//     artifacts: "./artifacts-zk",
//     cache: "./cache-zk",
//     sources: "./contracts",
//     tests: "./test",
//   },
//   solidity: {
//     version: "0.8.23",
//     defaultNetwork: 'sepolia',
//     networks: {
//       hardhat: {},
//       sepolia: {
//         url: 'https://1rpc.io/sepolia',
//         accounts: [`0x${process.env.PRIVATE_KEY}`]
//       }
//     },
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200,
//       },
//     },
//   },
// };

// // require("@matterlabs/hardhat-zksync-solc");
// // require("@matterlabs/hardhat-zksync-verify");

// // /** @type import('hardhat/config').HardhatUserConfig */
// // module.exports = {
// //   zksolc: {
// //     version: "1.4.1",
// //     compilerSource: "binary",
// //     settings: { optimizer: { enabled: true } },
// //   },
// //   networks: {
// //     hardhat: {},
// //     sepolia: {
// //       url: "https://1rpc.io/sepolia",
// //       accounts: [`0x${process.env.PRIVATE_KEY}`],
// //     },
// //     zkSyncSepoliaTestnet: {
// //       url: "https://sepolia.era.zksync.dev",
// //       ethNetwork: "sepolia",
// //       zksync: true,
// //       chainId: 300,
// //       verifyURL:
// //         "https://explorer.sepolia.era.zksync.dev/contract_verification",
// //     },
// //     zkSyncMainnet: {
// //       url: "https://mainnet.era.zksync.io",
// //       ethNetwork: "mainnet",
// //       zksync: true,
// //       chainId: 324,
// //       verifyURL:
// //         "https://zksync2-mainnet-explorer.zksync.io/contract_verification",
// //     },
// //   },
// //   defaultNetwork: "sepolia",
// //   paths: {
// //     artifacts: "./artifacts-zk",
// //     cache: "./cache-zk",
// //     sources: "./contracts",
// //     tests: "./test",
// //   },
// //   solidity: {
// //     version: "0.8.23",
// //     settings: {
// //       optimizer: { enabled: true, runs: 200 },
// //     },
// //   },
// // };

require("@matterlabs/hardhat-zksync-solc");
require("@matterlabs/hardhat-zksync-verify");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  zksolc: {
    version: "1.4.1",
    compilerSource: "binary",
    settings: { optimizer: { enabled: true } },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://1rpc.io/sepolia",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,  // ✅ single key for all networks
    customChains: [
      {
        network: "sepolia",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
    ],
  },
};
