import express from "express";
import { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } from "web3";
import { Web3BaseProvider } from "web3-types";
import { GasHelper } from "./util";
import { deployContract, getAccount, getContract, initProvider, nullAddress } from "common";
import { verifySignature } from "../services";

const app = express();
const port = 3001;

let issuerRegisterAddress: string;
let trustanchorAddress: string;
let web3Provider: Web3BaseProvider;
  let web3: Web3;

  try {
    web3Provider = initProvider();
    web3 = new Web3(web3Provider);
  } catch (error) {
    console.error(error);
    throw "Web3 cannot be initialised.";
  }
  getAccount(web3, "acc0");
  const from = web3.eth.accounts.wallet[0].address;


  app.post("/verify-request", async(req: any, res: any) => {})

app.post("/verify", async(req: any, res: any) => {
  const data = req.body;
  const issuerAddress = data?.issuerAddress;
  const issuerSignature = data?.issuerSignature;
  const holderWallet = data?.holderWallet;

  const result = await verifySignature({
    issuerRegistryAddress: issuerRegisterAddress,
    issuerAddress,
    issuerSignature,
  });

  // Emit result
  const trustAnchorContract = getContract("TrustAnchor", trustanchorAddress, web3);

  const contract = trustAnchorContract.methods.verify(
    holderWallet || nullAddress,
    nullAddress,
    "200",
    ""
  );

  const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
  const gasLimit = await contract.estimateGas({ from }, DEFAULT_RETURN_FORMAT);

  const tx = await contract.send({
    from,
    gasPrice,
    gas: GasHelper.gasPay(gasLimit),
  });

  res.sendStatus(200);
  
});

app.listen(port, async () => {
  const cmdArgs = process.argv.slice(2);

  const address = cmdArgs[0];
  const issReAddr = cmdArgs[1];
  console.log("ver regis addr", address);
  console.log("ver regis addr", issReAddr);
  issuerRegisterAddress = issReAddr;

  trustanchorAddress = await deployContract("TrustAnchor", from, web3);
  console.log("Deploy Verifier with Address", trustanchorAddress);

  const verifierRegistryContract = getContract(
    "VerifierRegistry",
    address,
    web3
  );

  const contract = verifierRegistryContract.methods.registerContract(
    trustanchorAddress,
    0
  );

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

  console.log(`Example app listening on port ${port}`);
});
