import express from "express";
import { Web3, ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } from "web3";
import { Web3BaseProvider } from "web3-types";
import crypto from "crypto";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { GasHelper } from "./util";
import {
  deployContract,
  getAccount,
  getContract,
  initProvider,
  nullAddress,
} from "common";
import { TrustAnchorURL, verifySignature } from "../services";
import axios from "axios";
import * as fs from 'fs'

const app = express();
app.use(express.json());
const port = 3002;
let issuerAddress: string;

let web3Provider: Web3BaseProvider;
let web3: Web3;

let priKey: string;
let pubKey: string;

try {
  web3Provider = initProvider();
  web3 = new Web3(web3Provider);
} catch (error) {
  console.error(error);
  throw "Web3 cannot be initialised.";
}
getAccount(web3, "acc0");
const from = web3.eth.accounts.wallet[0].address;

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
  const data = fs.readFileSync("../../.dev.txt", 'utf-8')
  const [_, address] = data.split("\n")

  console.log("ver regis addr", address);

  issuerAddress = await deployContract("Issuer", from, web3);
  console.log("Deploy Issuer with Address", issuerAddress);

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

  const issuerRegistryContract = getContract("IssuerRegistry", address, web3);

  const contract = issuerRegistryContract.methods.addSignature(
    issuerAddress,
    pubKey
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
