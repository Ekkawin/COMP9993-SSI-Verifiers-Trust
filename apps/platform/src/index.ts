import { GasHelper } from "./util";
const {
  Web3,
  ETH_DATA_FORMAT,
  DEFAULT_RETURN_FORMAT,
  Contract,
} = require("web3");
import type { Web3BaseProvider, AbiStruct } from "web3-types";
import { compileSols, writeOutput } from "./solc-lib";
import { log } from "console";
import { deployContract, getAccount, initProvider } from "./helper";
let fs = require("fs");
const path = require("path");
// import initProvider from '@common'

// const prisma = new PrismaClient();



async function main() {
  let web3Provider: Web3BaseProvider;
  let web3: typeof Web3;

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
  console.log("Deploy Graph Smart Contract with Address", graphAddress);

  const verifierAddress = await deployContract("VerifierRegistry", from, web3);
  console.log("Deploy Verifier Registry Smart Contract with Address", verifierAddress);

  // await prisma.factory.create({
  //   data: {
  //     address,
  //   },
  // });

  console.log("Add Factory Contract to Database");
}

main();
