// const hre = require("hardhat");

// async function main() {
//   console.log("🚀 Deploying CrowdFunding contract...");

//   const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
//   const crowdfunding = await CrowdFunding.deploy();

//   await crowdfunding.waitForDeployment();

//   console.log("✅ Contract deployed at:", await crowdfunding.getAddress());
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error("❌ Deployment failed:", error);
//     process.exit(1);
//   });

const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying CrowdFunding contract...");

  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdfunding = await CrowdFunding.deploy();
  await crowdfunding.waitForDeployment();

  const address = await crowdfunding.getAddress();
  console.log("✅ Contract deployed at:", address);

  console.log("🧾 Verifying contract...");
  await hre.run("verify:verify", {
    address,
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
