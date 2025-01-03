import "@nomicfoundation/hardhat-ethers";
import { url } from "inspector";

module.exports = {
    defaultNetwork: "localhost",
    networks: {
      hardhat: {
      },
    test:{
      //url: "http://149.28.176.241"
      url: "http://20.197.14.240"
    },
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: ["9f0166600d6479cc28d32c0787c76d5a69b183c167793fb6cd2a5aa43d096c1e"]
    }
     
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