import "@nomicfoundation/hardhat-ethers";

module.exports = {
    defaultNetwork: "http://20.193.133.12",
    networks: {
      hardhat: {
      },
     
    },
    solidity: {
      version: "0.8.27",
    },
    paths: {
      sources: "./contracts",
      tests: "./test",
      cache: "./cache",
      artifacts: "./artifacts"
    },
    mocha: {
      timeout: 40000
    }
}