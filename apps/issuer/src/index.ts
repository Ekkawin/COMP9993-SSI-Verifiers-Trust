import express from "express";
import crypto from "crypto";
import * as fs from "fs";
import { ethers } from "hardhat";

const app = express();
app.use(express.json());
const port = 3002;
let issuerAddress: string;

let priKey: string;
let pubKey: string;

app.post("/issuer/issueCertificate", async (req: any, res: any) => {
  const issuedDate = new Date().toISOString();
  const age = 20;
  const data = crypto.privateEncrypt(
    priKey,
    Buffer.from(JSON.stringify({ age }))
  );

  const message = { issuerAddress, issuedDate, data };
  res.send({ message });
});

app.listen(port, async () => {
  const data = fs.readFileSync("../../.dev.txt", "utf-8");
  const [_, address] = data.split("\n");

  console.log("ver regis addr", address);

  const issuerContract = await ethers.deployContract("Issuer");
  console.log("Deploy Issuer with Address", String(issuerContract?.target));
  issuerAddress = String(issuerContract?.target);

  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096, // bitsstandard for RSA keys
    publicKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
    privateKeyEncoding: {
      type: "pkcs1", // "Public Key Cryptography Standards 1"
      format: "pem", // Most common formatting choice
    },
  });
  pubKey = publicKey;
  priKey = privateKey;

  const issuerRegistryContract = await ethers.getContractAt(
    "IssuerRegistry",
    address
  );
  console.log("key", pubKey)

  const tx = await issuerRegistryContract.addSignature(issuerAddress, pubKey);

  console.log(`Issuer app listening on port ${port}`);
});
