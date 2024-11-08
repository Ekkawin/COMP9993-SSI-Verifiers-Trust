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

// app.post("/add-root", async (req, res) => {
//   const data = req.body;
//   const address = data?.contractAddress;

//   const L1VerifierRegistryContract = await ethers.getContractAt(
//     "L1VerifierRegistry",
//     l1VerifierAddress
//   );

//   const tx = await L1VerifierRegistryContract.addRoot(address);

//   console.log(tx);
//   res.send(200);
// });

app.post("/graph", async (req, res) => {
  const srcAddress = req?.body?.srcAddress;
  const desAddress = req?.body?.desAddress;
  const holderWallet = req?.body?.holderWallet;

  try {
    const verifierRegistryContract = await ethers.getContractAt(
      "VerifierRegistry",
      verifierRegistryAddress
    );

    const eventEmitterContract = await ethers.getContractAt(
      "VerifyEventEmitter",
      emitterAddress
    );

    const srcContractType = await verifierRegistryContract.getContractType(
      srcAddress
    );
    const desContractType = await verifierRegistryContract.getContractType(
      desAddress
    );

    if (Number(srcContractType) != 0) {
      const owner = await verifierRegistryContract.getContractOwner(srcAddress);

      console.log(owner);

      if (owner.toLowerCase() !== holderWallet.toLowerCase()) {
        throw new Error("unauthorized");
      }
    }

    if (Number(srcContractType) === 2) {
      throw new Error("VSP can not be trustor");
    }

    if (Number(srcContractType) === 1 && Number(desContractType) !== 2) {
      throw new Error("Verifier can not be trustor if VSP is the trustee");
    }

    const data = await prisma.graphEdge.upsert({
      where: {
        srcAddress_desAddress: {
          srcAddress,
          desAddress,
        },
      },
      update: {},
      create: {
        srcAddress,
        desAddress,
      },
    });

    await eventEmitterContract.emitUpdateGraphEvent(
      srcAddress,
      desAddress,
      holderWallet
    );

    res.send({ status: 200, message: data });
  } catch (err) {
    res.send({ status: 400, message: String(err) });
  }
});

app.post("/score", async (req, res) => {
  const srcAddress = req?.body?.srcAddress;
  const holderWallet = req?.body?.holderWallet;
  const score = req?.body?.score || 0;
  const eventNumber = req?.query?.eventNumber;
  try {
    const hasClaimed = await prisma.event.findUnique({
      where: { eventNumber: Number(eventNumber) },
    });

    if (hasClaimed) {
      throw new Error("Event is already claim");
    }

    const verifierRegistryContract = await ethers.getContractAt(
      "VerifierRegistry",
      verifierRegistryAddress
    );

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
    console.log(contractType);

    from = await emitterContract.filters.VSPVerify(
      eventNumber,
      null,
      null,
      null
    );
    logs = (await emitterContract.queryFilter(from, 0)) as any[];

    switch (Number(contractType)) {
      case 2:
        from = await emitterContract.filters.VSPVerify(
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
    console.log(logs[0]?.args[1].toLowerCase());
    if (logs[0]?.args[1].toLowerCase() !== holderWallet.toLowerCase()) {
      throw new Error("unauthorized");
    }

    await prisma.event.create({
      data: {
        eventNumber: Number(eventNumber),
        holderAddress: holderWallet,
        hasClaimed: true,
      },
    });

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

    // await emitterContract.emitScoringEvent(Number(eventNumber), holderWallet);

    res.send({
      eventNumber: Number(eventNumber),
      holderAddress: holderWallet,
      hasClaimed: true,
    });
  } catch (err) {
    res.send({ status: 400, message: String(err) });
  }
});

app.get("/graph", async (req, res) => {
  const address = req?.query?.address;
  if (!address) {
    res.send({ status: 400, message: "Error: no given address" });
  }

  if (address === "all") {
    const edges = await prisma.graphEdge.findMany({
      orderBy: { desAddress: "asc" },
    });

    res.send({ status: 200, message: { edges } });
  } else {
    const edges = await prisma.graphEdge.findMany({
      where: { desAddress: address as string },
    });
    res.send({ status: 200, message: { edges } });
  }
});

app.get("/score", async (req, res) => {
  const address = req?.query?.address;
  if (!address) {
    res.send({ status: 400, message: "Error: no given address" });
  }

  if (address === "all") {
    const nodes = await prisma.node.findMany({
      orderBy: { address: "asc" },
    });

    res.send({ status: 200, message: { nodes } });
  } else {
    const nodes = await prisma.node.findMany({
      where: { address: address as string },
    });
    res.send({ status: 200, message: { nodes } });
  }
});

// app.get("/merkletree/:id", async (req, res) => {
//   const id = req?.params?.id;
//   const rootAddress = req?.query?.rootAddress;
//   const L1VerifierRegistry = await ethers.getContractAt(
//     "L1VerifierRegistry",
//     l1VerifierAddress
//   );
//   const rootHash = await L1VerifierRegistry.getHash(rootAddress);

//   const _addresses = await prisma.l1Node.findMany({
//     where: {
//       rootAddress: rootAddress as string,
//     },
//   });

//   const addresses = _addresses.map(({ nodeAddress }) => nodeAddress);
//   console.log("address", addresses);
//   const hashes = compileHashAddresses(addresses);
//   const hashedId = compileHashAddresses([id])[0];
//   console.log("hash", hashes);
//   const merkleProof = generateMerkleProof(hashedId, hashes);
//   const root = makeMerkelRootFromProof(merkleProof);
//   console.log("merkleProof", merkleProof);
//   console.log("hash", root, "\n", rootHash);

//   res.send({ message: { isMatch: root === rootHash, merkleProof } });
// });

app.listen(port, async () => {
  await prisma.graphEdge.deleteMany();
  await prisma.event.deleteMany();
  await prisma.node.deleteMany();
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

  // console.log("\n\nGRAPH CONTRACT ADDRESS:  ", graphAddress);
  console.log("VERIFIERREGISTRY CONTRACT ADDRESS", verifierRegistryAddress);
  console.log("ISSUERREGISTRY CONTRACT ADDRESS", issuerRegistryAddress);
  // console.log("L1VERIFIERREGISTRY CONTRACT ADDRESS", l1VerifierAddress, "\n\n");
  console.log("EMITTER CONTRACT ADDRESS", emitterAddress, "\n\n");

  console.log(`Platform's listening on port ${port}`);
});
