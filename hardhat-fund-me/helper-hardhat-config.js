const networkConfig = {
  4: {
    name: "rinkeby",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
  },
  // hardhat
};

const developmentChains = ["hardhat", "localhost", "mine"];
const DECIMAL = 8;
const INITIAL_ANS = 200000000000;

module.exports = { networkConfig, developmentChains, DECIMAL, INITIAL_ANS };
