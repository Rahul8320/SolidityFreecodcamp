const { network } = require("hardhat");
const {
  developmentChains,
  DECIMAL,
  INITIAL_ANS,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const networkName = network.name;

  if (developmentChains.includes(networkName)) {
    log("---------------------------------------------");
    log("👀 Local network detected!Deploying Mocks......");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMAL, INITIAL_ANS],
    });
    log("✔ Mocks Deployed!");
  }
};

module.exports.tags = ["all", "mocks"];
