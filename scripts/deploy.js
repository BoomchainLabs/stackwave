import { ethers } from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const tokenFactory = await ethers.getContractFactory("StackWaveToken");
  const token = await tokenFactory.deploy();
  await token.waitForDeployment();
  console.log("StackWaveToken deployed to:", await token.getAddress());

  const stakingFactory = await ethers.getContractFactory("StackWaveStaking");
  const staking = await stakingFactory.deploy(await token.getAddress());
  await staking.waitForDeployment();
  console.log("StackWaveStaking deployed to:", await staking.getAddress());

  const paymentsFactory = await ethers.getContractFactory("StackWavePayments");
  const payments = await paymentsFactory.deploy();
  await payments.waitForDeployment();
  console.log("StackWavePayments deployed to:", await payments.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
