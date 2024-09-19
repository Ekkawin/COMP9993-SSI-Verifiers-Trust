const express = require("express");
const app = express();
const port = 3000;

const { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } = require("web3");
import {  Web3BaseProvider } from "web3-types";

import {
  deployContract,
  getAccount,
  getContract,
  initProvider,
} from "./helper";
import { compileSols, writeOutput } from "./solc-lib";
import { log } from "console";
import { GasHelper } from "./util";
let fs = require("fs");
const path = require("path");

app.post("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  const cmdArgs = process.argv.slice(2);

  const address = cmdArgs[0];
  console.log("ver regis addr", address);

  let web3Provider: Web3BaseProvider;
  let web3: typeof Web3;

  try {
    web3Provider = initProvider();
    web3 = new Web3(web3Provider);
  } catch (error) {
    console.error(error);
    throw "Web3 cannot be initialised.";
  }
  getAccount(web3, "acc0");

  const from = web3.eth.accounts.wallet[0].address;

  const verifierAddress = await deployContract("Verifier", from, web3);
  console.log("Deploy Verifier with Address", verifierAddress);

  const verifierRegistryContract = getContract(
    "VerifierRegistry",
    address,
    web3
  );

  const contract =  verifierRegistryContract.methods
    .registerContract(verifierAddress, 0)

  const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
  const gasLimit = await contract.estimateGas(
    { from },
    DEFAULT_RETURN_FORMAT // the returned data will be formatted as a bigint
  );

  const tx = await contract.send({
    from,
    gasPrice,
    gas: GasHelper.gasPay(gasLimit),
  });

    
  const owner = await verifierRegistryContract.methods
  .getOwner(verifierAddress, 0)
  .call({ from });

  console.log(`owner ${owner}`);
  console.log(`Example app listening on port ${port}`);
});
