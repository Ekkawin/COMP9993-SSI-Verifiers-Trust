import express from "express";
import { nullAddress } from "common";
import { TrustAnchorURL, verifyContext, verifySignature } from "../services";
import axios from "axios";
import * as fs from "fs";
import { ethers } from "hardhat";

const app = express();
app.use(express.json());
const port = 3000;
let issuerRegisterAddress: string;
let verifierAddress: string;

app.post("/verify", async (req: any, res: any) => {
  const data = req.body;
  const issuerAddress = data?.issuerAddress;
  const issuerSignature = data?.issuerSignature;
  const holderWallet = data?.holderWallet;
  const key = data?.key;

  const result = await verifySignature({
    issuerRegistryAddress: issuerRegisterAddress,
    issuerAddress,
    issuerSignature,
  });

  await verifyContext(key, data?.data);

  // Emit result
  const verifierContract = await ethers.getContractAt(
    "Verifier",
    verifierAddress
  );

  const tx = await verifierContract.verify(
    holderWallet || nullAddress,
    "200",
    ""
  );

  res.sendStatus(200);
});

app.post("/verify-trustanchor/:address", async (req: any, res: any) => {
  const _trustAnchorAddress = req.params?.address;
  if (!_trustAnchorAddress) {
    res.status(400);
    req.send({ message: "Require trust anchor address" });
  }
  console.log("trustAnchorAddress", _trustAnchorAddress);
  try {
    const request = await axios.post(
      TrustAnchorURL.TRUSTANCHORA,
      {
        verifierAddress,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(request,"hi\n")
    const message = request?.data;
    // console.log(message)
    res.send(message);
  } catch (error) {
    res.send(400);
  }
  // res.sendStatus(200);
});

app.post("/receiveResult/:id", async (req: any, res: any) => {
  const id = req.params?.id;
  const message = id;
  res.send(message);
});

app.listen(port, async () => {
  const data = fs.readFileSync("../../.dev.txt", "utf-8");

  const [address, issReAddr, _, _a, emitterAddress] = data.split("\n");

  console.log("ver regis addr", address);
  console.log("ver regis addr", issReAddr);
  issuerRegisterAddress = issReAddr;

  const _verifierContract = await ethers.getContractFactory("Verifier");
  const verifierContract = await _verifierContract.deploy(emitterAddress)
  verifierAddress = String(verifierContract?.target);
  console.log("Deploy Verifier with Address", verifierAddress);

  const verifierRegistryContract = await ethers.getContractAt(
    "VerifierRegistry",
    address
  );

  const tx = await verifierRegistryContract.registerContract(
    verifierAddress,
    1
  );

  console.log(`Example app listening on port ${port}`);
});
