import { deployContract, getAccount, initProvider } from "common";
import {
  Web3
} from "web3";
import type { Web3BaseProvider, AbiStruct } from "web3-types";

async function main() {
  let web3Provider: Web3BaseProvider;
  let web3: Web3;

  try {
    web3Provider = initProvider()
    web3 = new Web3(web3Provider);
  } catch (error) {
    console.error(error);
    throw "Web3 cannot be initialised.";
  }
  getAccount(web3, "acc0");

  const from = web3.eth.accounts.wallet[0].address;

  
  const graphAddress = await deployContract("Graph", from, web3);
  const verifierRegistryAddress = await deployContract("VerifierRegistry", from, web3);
  const issuerRegistryAddress = await deployContract("IssuerRegistry", from, web3);


  console.log("\n\nGRAPH CONTRACT ADDRESS:  ", graphAddress);
  console.log("VERIFIERREGISTRY CONTRACT ADDRESS", verifierRegistryAddress);
  console.log("ISSUERREGISTRY CONTRACT ADDRESS", issuerRegistryAddress, "\n\n");


}

main();
