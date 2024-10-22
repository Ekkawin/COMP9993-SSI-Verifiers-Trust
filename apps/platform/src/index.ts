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

    const nodes = await prisma.node.findMany({
      orderBy: { address: "asc" },
      select: { address: true, score: true },
    });

    const edges = await prisma.graphEdge.findMany({
      orderBy: { desAddress: "asc" },
    });

    console.log(edges);
    console.log(nodes);

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
  const eventNumber = req?.query?.eventNumber;

  const verifierRegistryContract = await ethers.getContractAt(
    "VerifierRegistry",
    verifierRegistryAddress
  );

  try {
    const contractType = await verifierRegistryContract.getContractType(
      srcAddress
    );
    const owner = await verifierRegistryContract.getContractOwner(srcAddress);

    let from;
    let logs;

    const emitterContract = await ethers.getContractAt(
      "VerifyEventEmitter",
      emitterAddress
    );

    if (owner.toLowerCase() !== holderWallet.toLowerCase())
      throw new Error("unauthorized");
    from = await emitterContract.filters.TAVerify(
      eventNumber,
      null,
      null,
      null
    );
    logs = (await emitterContract.queryFilter(from, 0)) as any[];

    switch (Number(contractType)) {
      case 2:
        from = await emitterContract.filters.TAVerify(
          eventNumber,
          null,
          null,
          null,
          null,
          null
        );
        logs = (await emitterContract.queryFilter(from, 0)) as any[];
        break;
      case 1:
        from = await emitterContract.filters.Verify(
          eventNumber,
          null,
          null,
          null,
          null
        );
        logs = (await emitterContract.queryFilter(from, 0)) as any[];

        break;
      default: {
        throw new Error("not register");
      }
    }
    if (!logs?.length) throw new Error("no reccord");
    console.log(logs)

    const hasClaimed = await prisma.event.findUnique({
      where: { eventNumber: Number(eventNumber) },
    });

    if (hasClaimed) {
      throw new Error("Event is already claim");
    } else {
      await prisma.event.create({
        data: {
          eventNumber: Number(eventNumber),
          holderAddress: holderWallet,
          hasClaimed: true,
        },
      });
    }

    // await emitterContract.emitScoringEvent(Number(eventNumber), holderWallet);

    res.send({
      eventNumber: Number(eventNumber),
      holderAddress: holderWallet,
      hasClaimed: true,
    });
  } catch (_) {
    console.log(_);
    res.send(400);
  }
});

app.get("/graph", async (req, res) => {
  const nodes = await prisma.node.findMany({
    orderBy: { address: "asc" },
    select: { address: true, score: true },
  });

  const edges = await prisma.graphEdge.findMany({
    orderBy: { desAddress: "asc" },
  });

  console.log(edges);
  console.log(nodes);
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
  await prisma.graphEdge.deleteMany();
  await prisma.event.deleteMany();
  const platformAddresses = await prisma.platformContractAddress.findFirst();
  l1VerifierAddress = platformAddresses?.lVerifierAddress as string;
  verifierRegistryAddress =
    platformAddresses?.verifierRegistryAddress as string;
  graphAddress = platformAddresses?.graphContractAddress as string;
  const issuerRegistryAddress =
    platformAddresses?.issuerRegistryAddress as string;
  emitterAddress = platformAddresses?.emitterAddress as string;

  const emitterContract = await ethers.getContractAt(
    "VerifyEventEmitter",
    emitterAddress
  );
  // emitterContract.on(
  //   "TAVerify",
  //   async (eventNumber, holderAddress, verifierAddress, status, message, callerAddress) => {
  //     console.log(
  //       "eventNumber\n",
  //       eventNumber,
  //       "holderAddress\n",
  //       holderAddress,
  //       "verifierAddress\n",
  //       verifierAddress,
  //       "status\n",
  //       status,
  //       "message\n",
  //       message,
  //       "callerAddress\n",
  //       callerAddress
  //     );
  //   }
  // );

  emitterContract.on("GiveScore", (eventNumber, address) => {
    console.log(
      `GiveScore EventNumber: ${Number(eventNumber)}\n Address: ${address}`
    );
  });

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
