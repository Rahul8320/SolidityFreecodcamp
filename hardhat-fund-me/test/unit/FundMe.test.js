const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", () => {
      let fundMe, deployer, mockV3Aggregator;
      const sendValue = ethers.utils.parseEther("0.3");

      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", () => {
        it("sets the aggregator address correctly.", async () => {
          const response = await fundMe.getPriceFeed();
          assert.equal(response, mockV3Aggregator.address);
        });
      });

      describe("Fund Revert", () => {
        it("Fund failed if we not send enough ETH.", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You have to send more ETH!"
          );
        });
      });

      describe("Fund Success", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });

        it("Update the amount funded data structure.", async () => {
          const response = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });

        it("Adds funder to array of funders.", async () => {
          const response = await fundMe.getFunders(0);
          assert.equal(response, deployer);
        });
      });

      describe("Withdraw", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });

        it("Withdraw ETH from a single founder", async () => {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startingDeployerBalance.add(startingFundMeBalance).toString()
          );
        });

        it("Allows us to withdraw with multiple funders", async () => {
          const accounts = await ethers.getSigners();
          for (let i = 1; i < 6; i++) {
            const fundMeContractConnect = await fundMe.connect(accounts[i]);
            await fundMeContractConnect.fund({ value: sendValue });
          }

          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startingDeployerBalance.add(startingFundMeBalance).toString()
          );
          // make sure the funders are reset properly
          await expect(fundMe.getFunders(0)).to.be.reverted;
          for (let i = 1; i < 6; i++) {
            assert.equal(
              await fundMe.getAddressToAmountFunded(accounts[i].address),
              0
            );
          }
        });

        it("Only allows the owner to withdraw.", async () => {
          const accounts = await ethers.getSigners();
          // const attacker = accounts[2];
          const attackerConnectContract = await fundMe.connect(accounts[2]);
          await expect(
            attackerConnectContract.withdraw()
          ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner");
        });
      });
    });
