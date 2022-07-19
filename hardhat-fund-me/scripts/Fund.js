const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  console.log("Fetching Contract FundMe....");
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding Contract FundMe....");
  const txResponse = await fundMe.fund({ value: ethers.utils.parseEther("1") });
  await txResponse.wait(1);
  console.log("Funded Successful!");
  console.log(`Contract Balance : ${await fundMe.provider.getBalance(fundMe.address)}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
