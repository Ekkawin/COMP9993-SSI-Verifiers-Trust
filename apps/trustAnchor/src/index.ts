import express from "express";
import { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } from "web3";
import { Web3BaseProvider } from "web3-types";
import { GasHelper } from "./util";
import {
  deployContract,
  getAccount,
  getContract,
  initProvider,
  nullAddress,
} from "common";
import { verifyContext, verifySignature } from "../services";
import * as bodyParser from 'body-parser'
import * as fs from 'fs'

const app = express();
const port = 3001;

app.use(bodyParser.json()) // handle json data
  

let issuerRegisterAddress: string;
let trustanchorAddress: string;
let web3Provider: Web3BaseProvider;
let web3: Web3;

let requestors:any ={}

try {
  web3Provider = initProvider();
  web3 = new Web3(web3Provider);
} catch (error) {
  console.error(error);
  throw "Web3 cannot be initialised.";
}
getAccount(web3, "acc0");
const from = web3.eth.accounts.wallet[0].address;

app.post("/verify-request", async (req: any, res: any) => {

  // console.log("hi")
  const id = (Math.random() * 1000).toFixed(0).toString()
  const verifierAddress  = req.body?.verifierAddress
  requestors = {...requestors,  [id]:verifierAddress}

  
  res.send({message: `Your tracsaction is ${id}` })
  
});

app.post("/verify/:id", async (req: any, res: any) => {
  const id = req.params?.id as string
  const data = req.body;
  const issuerAddress = data?.issuerAddress;
  const issuerSignature = data?.issuerSignature;
  const holderWallet = data?.holderWallet;
  const verifierAddress = requestors[id] 
  
  

  const result = await verifySignature({
    issuerRegistryAddress: issuerRegisterAddress,
    issuerAddress,
    issuerSignature,
  });

  const issuerRegistryContract = getContract("IssuerRegistry", issuerRegisterAddress, web3)
  const publicKey =  await issuerRegistryContract.methods.getSignature(issuerAddress).call({from})
  

  await verifyContext(publicKey, Buffer.from(data?.data))

  // Emit result
  const trustAnchorContract = getContract(
    "TrustAnchor",
    trustanchorAddress,
    web3
  );

  const contract = trustAnchorContract.methods.verify(
    holderWallet || nullAddress,
    verifierAddress || nullAddress,
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
  const data = fs.readFileSync("../../.dev.txt", 'utf-8')

  const [address, issReAddr] = data.split("\n")
  console.log("ver regis addr", address);
  console.log("ver regis addr", issReAddr);
  issuerRegisterAddress = issReAddr;

  trustanchorAddress = await deployContract("TrustAnchor", from, web3);
  console.log("Deploy Trust Anchor with Address", trustanchorAddress);


  interface Option {
    readonly address?: string | string[] | undefined;
    readonly topics?: string[] | undefined;
  }

  const optionsTAVerify: Option = {
    address: trustanchorAddress,
    topics: [web3.utils.sha3('TAVerify(address,address,string,string)')] as string[],
  };
  const jsonInterfaceTAVerify = [
    {
      type: "address",
      name: "callerAddress",
    },
    {
      type: "address",
      name: "verifierAddress",
    },
    {
      type: "string",
      name: "status",
    },
    {
      type: "string",
      name: "message",
    },
  ];

  const subscriptionTAVerify = await web3.eth.subscribe(
    "logs",
    optionsTAVerify
  );
  subscriptionTAVerify.on("data", async (event: any) => {
    const eventData = web3.eth.abi.decodeLog(
      jsonInterfaceTAVerify,
      event.data,
      event.topics
    );
    console.log(`Event TAVerify Caller Address: ${eventData.callerAddress}, Verifier Address: ${eventData.verifierAddress}, Status: ${eventData.status}, Message: ${eventData.message}`);
  });
  subscriptionTAVerify.on("error", async (error: any) =>
    console.log("Error listening on event: ", error)
  );


  const verifierRegistryContract = getContract(
    "VerifierRegistry",
    address,
    web3
  );

  const contract = verifierRegistryContract.methods.registerContract(
    trustanchorAddress,
    2
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
