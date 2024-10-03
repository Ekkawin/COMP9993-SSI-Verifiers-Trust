import express from "express";
import { nullAddress } from "common";
import { verifyContext, verifySignature } from "../services";
import * as bodyParser from "body-parser";
import * as fs from "fs";
import { ethers } from "hardhat";

const app = express();
const port = 3001;

app.use(bodyParser.json()); // handle json data

let issuerRegisterAddress: string;
let trustanchorAddress: string;

let requestors: any = {};

app.post("/verify-request", async (req: any, res: any) => {
  // console.log("hi")
  const id = (Math.random() * 1000).toFixed(0).toString();
  const verifierAddress = req.body?.verifierAddress;
  requestors = { ...requestors, [id]: verifierAddress };

  res.send({ message: `Your tracsaction is ${id}`, requestId:id });
});

app.post("/verify/:id", async (req: any, res: any) => {
  const id = req.params?.id as string;
  const data = req.body;
  const issuerAddress = data?.issuerAddress;
  const issuerSignature = data?.issuerSignature;
  const holderWallet = data?.holderWallet;
  const verifierAddress = requestors[id];

  const result = await verifySignature({
    issuerRegistryAddress: issuerRegisterAddress,
    issuerAddress,
    issuerSignature,
  });

  const issuerRegistryContract = await ethers.getContractAt(
    "IssuerRegistry",
    issuerRegisterAddress
  );
  const publicKey = await issuerRegistryContract.getSignature(issuerAddress);

  // await verifyContext(publicKey, Buffer.from(data?.data))

  // Emit result
  const trustAnchorContract = await ethers.getContractAt(
    "TrustAnchor",
    trustanchorAddress
  );

  const tx = await trustAnchorContract.verify(
    holderWallet || nullAddress,
    verifierAddress || nullAddress,
    "200",
    ""
  );

  res.sendStatus(200);
});

app.listen(port, async () => {
  const data = fs.readFileSync("../../.dev.txt", "utf-8");

  const [address, issReAddr] = data.split("\n");
  console.log("ver regis addr", address);
  console.log("ver regis addr", issReAddr);
  issuerRegisterAddress = issReAddr;

  const trustanchorContract = await ethers.deployContract("TrustAnchor");
  trustanchorAddress = String(trustanchorContract.target);
  console.log("Deploy Trust Anchor with Address", trustanchorAddress);

  trustanchorContract.on(
    "TAVerify",
    (callerAddress, verifierAddress, status, message, _) => {
      console.log(
        `Event TAVerify Caller Address: ${callerAddress}, Verifier Address: ${verifierAddress}, Status: ${status}, Message: ${message}`
      );
    }
  );

  

  const verifierRegistryContract = await ethers.getContractAt(
    "VerifierRegistry",
    address
  );

  const tx = await verifierRegistryContract.registerContract(
    trustanchorAddress,
    2
  );

  console.log(`Example app listening on port ${port}`);
});
