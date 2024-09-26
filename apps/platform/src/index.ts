import { deployContract, getAccount, getContract, initProvider } from "common";
import { DEFAULT_RETURN_FORMAT, ETH_DATA_FORMAT, Web3 } from "web3";
import type { Web3BaseProvider, AbiStruct } from "web3-types";
import * as fs from "fs";
import express from "express";
import * as bodyParser from "body-parser";
import {
  compileRootHash,
  compileHashAddresses,
  makeMarkelTree,
  generateMerkleProof,
  makeMerkelRootFromProof,
} from "../services";
import { GasHelper } from "./util";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

interface Address {
  [key: string]: string[];
}

const prisma = new PrismaClient();

const app = express();
const port = 3003;
// let addresses: Address = {};
let l1VerifierAddress: string;
let verifierRegistryAddress: string;

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

app.use(bodyParser.json());

app.post("/add-root", async (req, res) => {
  const data = req.body;
  const address = data?.contractAddress;

  const contract = getContract(
    "L1VerifierRegistry",
    l1VerifierAddress,
    web3
  ).methods.addRoot(address);

  const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
  const gasLimit = await contract.estimateGas({ from }, DEFAULT_RETURN_FORMAT);

  const tx = await contract.send({
    from,
    gasPrice,
    gas: GasHelper.gasPay(gasLimit),
  });

  console.log(tx);
  res.send(200);
});

// app.put("/add-root", async (req, res) => {
//   const data = req.body;
//   const address = data?.contractAddress;
//   const callerAddress = data?.callerAddress

//   const verifierRegistryContract = getContract("VerifierRegistry", verifierRegistryAddress, web3)

//   const contract = getContract(
//     "L1VerifierRegistry",
//     l1VerifierAddress,
//     web3
//   ).methods.addHash(address, address);

//   const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
//   const gasLimit = await contract.estimateGas({ from }, DEFAULT_RETURN_FORMAT);

//   const tx = await contract.send({
//     from,
//     gasPrice,
//     gas: GasHelper.gasPay(gasLimit),
//   });

//   console.log(tx);
//   res.send(200);
// });

app.get("/merkletree/:id", async (req, res) => {
  const id = req?.params?.id;
  const rootAddress = req?.query?.rootAddress;
  const rootHash = await getContract(
    "L1VerifierRegistry",
    l1VerifierAddress,
    web3
  )
    .methods.getHash(rootAddress)
    .call({ from });
  const _addresses = await prisma.node.findMany({
    where: {
      rootAddress: rootAddress as string,
    },
  });

  const addresses = _addresses.map(({ nodeAddress }) => nodeAddress);
  console.log("address", addresses);
  const hashes = compileHashAddresses(addresses);
  const hashedId = compileHashAddresses([id])[0];
  console.log("hash", hashes);
  const merkleProof = generateMerkleProof(hashedId, hashes);
  const root = makeMerkelRootFromProof(merkleProof);
  console.log("merkleProof", merkleProof);
  console.log("hash", root, "\n", rootHash);

  res.send({ message: { isMatch: root === rootHash, merkleProof } });
});

app.listen(port, async () => {
  const platformAddresses = await prisma.platformContractAddress.findFirst();
  l1VerifierAddress = platformAddresses?.lVerifierAddress as string;
  verifierRegistryAddress =
    platformAddresses?.verifierRegistryAddress as string;
  const graphAddress = platformAddresses?.graphContractAddress as string;
  const issuerRegistryAddress =
    platformAddresses?.issuerRegistryAddress as string;

  interface Option {
    readonly address?: string | string[] | undefined;
    readonly topics?: string[] | undefined;
  }

  const optionsAddHash: Option = {
    address: l1VerifierAddress,
    topics: [web3.utils.sha3("AddHash(address,address)")] as string[],
  };
  const jsonInterfaceAddHash = [
    {
      type: "address",
      name: "root",
    },
    {
      type: "address",
      name: "newContractAddress",
    },
  ];

  const subscriptionAddHash = await web3.eth.subscribe("logs", optionsAddHash);
  subscriptionAddHash.on("data", async (event: any) => {
    const eventData = web3.eth.abi.decodeLog(
      jsonInterfaceAddHash,
      event.data,
      event.topics
    );
    console.log(
      `Event AddHash Root Address: ${eventData.root}, New Contract Address: ${eventData.newContractAddress}`
    );

    await prisma.node.create({
      data: {
        rootAddress: eventData.root as string,
        nodeAddress: eventData.newContractAddress as string,
        createdAt: new Date(),
      },
    });

    const _addresses = await prisma.node.findMany({
      where: {
        rootAddress: eventData.root as string,
      },
    });

    const addresses = _addresses.map(({ nodeAddress }) => nodeAddress);
    const hashAddresses = compileHashAddresses(addresses);
    const hash = compileRootHash(hashAddresses);
    console.log("Hash:", hash);

    const contract = getContract(
      "L1VerifierRegistry",
      l1VerifierAddress,
      web3
    ).methods._addHash(eventData.root, hash);
    const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
    const gasLimit = await contract.estimateGas(
      { from },
      DEFAULT_RETURN_FORMAT
    );

    const tx = await contract.send({
      from,
      gasPrice,
      gas: GasHelper.gasPay(gasLimit),
    });
  });

  subscriptionAddHash.on("error", async (error: any) =>
    console.log("Error listening on event: ", error)
  );

  console.log("\n\nGRAPH CONTRACT ADDRESS:  ", graphAddress);
  console.log("VERIFIERREGISTRY CONTRACT ADDRESS", verifierRegistryAddress);
  console.log("ISSUERREGISTRY CONTRACT ADDRESS", issuerRegistryAddress);
  console.log("L1VERIFIERREGISTRY CONTRACT ADDRESS", l1VerifierAddress, "\n\n");

  const data = verifierRegistryAddress + "\n" + issuerRegistryAddress;

  fs.writeFileSync("../../.dev.txt", data);

  console.log(`Platform app listening on port ${port}`);
});
