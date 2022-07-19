const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("---------------------------------------------");
  console.log("👀 Please wait EtherScan is Verifying your contract.......");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("✔ Contract verified!");
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("✔ Already verified!");
    } else {
      console.log(e);
    }
  }
};

module.exports = { verify };
