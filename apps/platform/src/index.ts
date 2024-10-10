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
import { EventLog } from "web3-types";

const prisma = new PrismaClient();

const app = express();
const port = 3003;
let l1VerifierAddress: string;
let verifierRegistryAddress: string;
let graphAddress: string;
let emitterAddress: string;

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

  // TODO: check the correcteness of forming a graph
  try {
    const x = await prisma.graphEdge.create({
      data: {
        srcAddress,
        desAddress,
      },
    });

    const nodes = await prisma.node.findMany({ orderBy: { address: "asc" } });

    const edges = await prisma.graphEdge.findMany({
      orderBy: { desAddress: "asc" },
    });

    const nodeHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(nodes))
      .digest("hex");

    const edgeHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(edges))
      .digest("hex");

    const hash = crypto
      .createHash("sha256")
      .update(edgeHash + nodeHash)
      .digest("hex");

    const graphContract = await ethers.getContractAt("Graph", graphAddress);
    await graphContract.modifyGraphHash(hash);
    res.send({ hash });
  } catch (_) {
    res.send(400);
  }
});

app.post("/score", async (req, res) => {
  const srcAddress = req?.body?.srcAddress;
  const holderWallet = req?.body?.holderWallet;
  const score = req?.body?.score || 0;

  const verifierRegistryContract = await ethers.getContractAt(
    "VerifierRegistry",
    verifierRegistryAddress
  );

  console.log("holderWallet", holderWallet);
  console.log("srcAddress", srcAddress);
  try {
    const contractType = await verifierRegistryContract.getContractType(
      srcAddress
    );
    console.log("contractType", contractType);

    let from;
    let logs;
    let hasRightToVote;
    const emitterContract = await ethers.getContractAt(
      "VerifyEventEmitter",
      emitterAddress
    );
    switch (Number(contractType)) {
      case 2:
        from = await emitterContract.filters.TAVerify(null, null, null, null);
        logs = (await emitterContract.queryFilter(from, 0)) as any[];
        console.log("logs", logs);
        hasRightToVote = logs.some((a) => {
          return (
            String(a?.args[0]).toLowerCase() == holderWallet.toLowerCase() &&
            String(a?.args[4]).toLowerCase() == srcAddress.toLowerCase()
          );
        });
        break;
      case 1:
        from = await emitterContract.filters.Verify(null, null, null);
        logs = (await emitterContract.queryFilter(from, 0)) as any[];
        hasRightToVote = logs.some(
          (a) =>
            String(a?.args[0]).toLowerCase() == holderWallet.toLowerCase() &&
            String(a?.args[3]).toLowerCase() == srcAddress.toLowerCase()
        );
        break;
      default: {
        throw new Error("not register");
      }
    }
    if (!logs?.length) throw new Error("no reccord");
    if (!hasRightToVote) throw new Error("user doesn't have right to vote");

    const node = await prisma.node.findUnique({
      where: { address: srcAddress },
    });
    if (node) {
      const dominator = node?.numberOfScorer;
      const _score = node?.score;
      await prisma.node.update({
        where: {
          address: srcAddress,
        },
        data: {
          score: Number((dominator * _score + score) / (dominator + 1)),
          numberOfScorer: dominator + 1,
        },
      });
    } else {
      await prisma.node.create({
        data: {
          address: srcAddress,
          score,
          numberOfScorer: 1,
        },
      });
    }

    const nodes = await prisma.node.findMany({ orderBy: { address: "asc" } });

    const edges = await prisma.graphEdge.findMany({
      orderBy: { desAddress: "asc" },
    });

    const nodeHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(nodes))
      .digest("hex");

    const edgeHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(edges))
      .digest("hex");

    const hash = crypto
      .createHash("sha256")
      .update(edgeHash + nodeHash)
      .digest("hex");

    const graphContract = await ethers.getContractAt("Graph", graphAddress);
    await graphContract.modifyGraphHash(hash);
    res.send({ hash });
  } catch (_) {
    console.log(_);
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
  res.send({ hash });
});

app.get("/merkletree/:id", async (req, res) => {
  const id = req?.params?.id;
  const rootAddress = req?.query?.rootAddress;
  const L1VerifierRegistry = await ethers.getContractAt(
    "L1VerifierRegistry",
    l1VerifierAddress
  );
  const rootHash = await L1VerifierRegistry.getHash(rootAddress);

  const _addresses = await prisma.l1Node.findMany({
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
  await prisma.graphEdge.deleteMany()
  const platformAddresses = await prisma.platformContractAddress.findFirst();
  l1VerifierAddress = platformAddresses?.lVerifierAddress as string;
  verifierRegistryAddress =
    platformAddresses?.verifierRegistryAddress as string;
  graphAddress = platformAddresses?.graphContractAddress as string;
  const issuerRegistryAddress =
    platformAddresses?.issuerRegistryAddress as string;
  emitterAddress = platformAddresses?.emitterAddress as string;

  const L1VerifierRegistryContract = await ethers.getContractAt(
    "L1VerifierRegistry",
    l1VerifierAddress
  );
  L1VerifierRegistryContract.on(
    "AddHash",
    async (root, newContractAddress, _) => {
      await prisma.l1Node.create({
        data: {
          rootAddress: String(root),
          nodeAddress: String(newContractAddress),
          createdAt: new Date(),
        },
      });

      const _addresses = await prisma.l1Node.findMany({
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
  console.log("EMITTER CONTRACT ADDRESS", emitterAddress, "\n\n");
});
