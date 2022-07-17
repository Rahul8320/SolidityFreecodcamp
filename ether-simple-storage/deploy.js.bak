const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Please wait .....Contact is deploying to network.");
  const contract = await contractFactory.deploy();
  const address = contract.address;
  console.log("Contract is deployed at address : ", address);
  await contract.deployTransaction.wait(1);
  const preNum = await contract.getFavNum();
  console.log("Previous favorite number : ", preNum.toString());
  await contract.store("26");
  await contract.deployTransaction.wait(1);
  const currNum = await contract.getFavNum();
  console.log("Current favorite number : ", currNum.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
