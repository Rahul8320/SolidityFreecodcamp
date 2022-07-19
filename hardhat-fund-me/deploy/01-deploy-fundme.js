const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let priceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get("MockV3Aggregator");
    priceFeedAddress = ethUsdAggregator.address;
  } else {
    priceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }

  const args = [priceFeedAddress];
  log("---------------------------------------------");
  log("👀 Deploying FundMe contract.........");
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args, // address of priceFeed contract
    log: true,
    waitConfirmations: network.config.blockConfirmation || 1,
  });
  
  log("✔ Contract deployed!");
  log("---------------------------------------------");

  if (!developmentChains.includes(network.name) && process.env.EC_API_KEY) {
    await verify(fundMe.address, args);
  }

  log("---------------------------------------------");
};

module.exports.tags = ["all", "fundme"];
