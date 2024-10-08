import express from "express";
import * as bodyParser from "body-parser";
import {
  compileRootHash,
  compileHashAddresses,
  generateMerkleProof,
  makeMerkelRootFromProof,
} from "../services";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { ethers } from "hardhat";

const prisma = new PrismaClient();

const app = express();
const port = 3003;
let l1VerifierAddress: string;
let verifierRegistryAddress: string;
let graphAddress: string;

app.use(bodyParser.json());

app.post("/add-root", async (req, res) => {
  const data = req.body;
  const address = data?.contractAddress;

  const L1VerifierRegistryContract = await ethers.getContractAt(
    "L1VerifierRegistry",
    l1VerifierAddress
  );

  const tx = await L1VerifierRegistryContract.addRoot(address);

  console.log(tx);
  res.send(200);
});

app.post("/graph", async (req, res) => {
  const srcAddress = req?.body?.srcAddress;
  const desAddress = req?.body?.desAddress;
  const score = req?.body?.score || 0;

  // TODO: check the correcteness of forming a graph
  try {

  const x = await prisma.graphEdge.create({
    data: {
      srcAddress,
      desAddress,
      score,
    },
  });
  console.log("X==>",x)

  const edges = await prisma.graphEdge.findMany({
    orderBy: { desAddress: "asc" },
  });
  console.log(edges);
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(edges))
    .digest("hex");
  console.log("hash", hash);
  
    const graphContract = await ethers.getContractAt("Graph", graphAddress);
    await graphContract.modifyGraphHash(hash);
    res.send({hash});
  } catch (_) {
    res.send(400);
  }
});

app.get("/graph", async (req, res) => {
  const edges = await prisma.graphEdge.findMany({
    orderBy: { desAddress: "asc" },
  });
  console.log(edges);
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(edges))
    .digest("hex");
  console.log("hash", hash);
  res.send({hash});
});

app.get("/merkletree/:id", async (req, res) => {
  const id = req?.params?.id;
  const rootAddress = req?.query?.rootAddress;
  const L1VerifierRegistry = await ethers.getContractAt(
    "L1VerifierRegistry",
    l1VerifierAddress
  );
  const rootHash = await L1VerifierRegistry.getHash(rootAddress);

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
  graphAddress = platformAddresses?.graphContractAddress as string;
  const issuerRegistryAddress =
    platformAddresses?.issuerRegistryAddress as string;

  const L1VerifierRegistryContract = await ethers.getContractAt(
    "L1VerifierRegistry",
    l1VerifierAddress
  );
  L1VerifierRegistryContract.on(
    "AddHash",
    async (root, newContractAddress, _) => {
      await prisma.node.create({
        data: {
          rootAddress: String(root),
          nodeAddress: String(newContractAddress),
          createdAt: new Date(),
        },
      });

      const _addresses = await prisma.node.findMany({
        where: {
          rootAddress: String(root),
        },
      });

      const addresses = _addresses.map(({ nodeAddress }) => nodeAddress);
      const hashAddresses = compileHashAddresses(addresses);
      const hash = compileRootHash(hashAddresses);
      L1VerifierRegistryContract._addHash(String(root), hash);
    }
  );

  console.log("\n\nGRAPH CONTRACT ADDRESS:  ", graphAddress);
  console.log("VERIFIERREGISTRY CONTRACT ADDRESS", verifierRegistryAddress);
  console.log("ISSUERREGISTRY CONTRACT ADDRESS", issuerRegistryAddress);
  console.log("L1VERIFIERREGISTRY CONTRACT ADDRESS", l1VerifierAddress, "\n\n");
});
