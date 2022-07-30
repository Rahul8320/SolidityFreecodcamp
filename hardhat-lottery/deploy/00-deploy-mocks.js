const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat.config");

const BASE_FEE = ethers.utils.parseEther("0.25"); // 0.25 is premium. It costs 0.25 LINK
const GAS_PRICE_LINK = 1e9; // Link per gas

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const args = [BASE_FEE, GAS_PRICE_LINK];

    if(developmentChains.includes(network.name)) {
        log("👀 Development chain detected.Deploying mocks.......");
        // deploying mocks
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        });
        log("✔ Mocks deployed!");
        log("-----------------------👍----------------------");
    }
}