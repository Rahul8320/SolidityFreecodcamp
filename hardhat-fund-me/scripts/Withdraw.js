const { getNamedAccounts, ethers } = require("hardhat");

const main = async () => {
  const { deployer } = await getNamedAccounts();
  console.log("Fetching contract.....");
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("Withdraw fund from FundMe......");
  const txResponse = await fundMe.withdraw();
  await txResponse.wait(1);
  console.log("Withdraw Successful");
  console.log(
    `Current FundMe Contract Balance : ${await fundMe.provider.getBalance(
      fundMe.address
    )}`
  );
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
