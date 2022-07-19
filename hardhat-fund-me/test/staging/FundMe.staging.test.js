const { assert } = require("chai");
const { network, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe Staging Test", async () => {
      let fundMe, deployer;
      const sendValue = ethers.utils.parseEther("0.22");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        // await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("Allows people to Fund and withdraw.", async () => {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });
