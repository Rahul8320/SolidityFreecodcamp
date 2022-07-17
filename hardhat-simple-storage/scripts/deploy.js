const { ethers, run, network } = require("hardhat");

async function main() {
  console.log(`> Script : deploy.js running......`);
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Please wait...... We are working on your deploying.");
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Your contract deployed at : ${simpleStorage.address}`);
  // verify the contract if network is rinkeby and etherscan api key is provided
  if (network.config.chainId === 4 && process.env.EC_API_KEY) {
    // await for a few block mined
    console.log(`Please wait..... We are mining some more block.`);
    await simpleStorage.deployTransaction.wait(5);
    await verify(simpleStorage.address, []);
  }

  // get fav num from contract
  const currentValue = await simpleStorage.getFavNum();
  console.log(`Current Favorite Number : ${currentValue}`);

  // update fav num in contract
  const transactionResponse = await simpleStorage.store(26);
  await transactionResponse.wait(1);
  const updatedValue = await simpleStorage.getFavNum();
  console.log(`Updated Favorite Number : ${updatedValue}`);
}

async function verify(contractAddress, args) {
  console.log(`Please wait..... We are verifying your contract in EtherScan.`);
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Your Contract is Already Verified!");
    } else {
      console.log(e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//9:13:37