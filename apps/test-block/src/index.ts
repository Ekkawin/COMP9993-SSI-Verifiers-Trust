// import express from "express";
// import * as bodyParser from "body-parser";
// import {
//   compileRootHash,
//   compileHashAddresses,
//   generateMerkleProof,
//   makeMerkelRootFromProof,
// } from "../services";
// import { PrismaClient } from "@prisma/client";
// import crypto from "crypto";
// import { ethers } from "hardhat";
import axios from "axios";
// import data from '../data.json'
import * as fs from "fs";

// const prisma = new PrismaClient();

async function main() {
  const concurrency = Number(process.argv.slice(2)[0]);

  const startTime = new Date();
  try {
    const halfTime = new Date();
    const u = await axios.post(
      `http://4.240.54.55/score`,
      {
        holderWallet: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        srcAddress: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        score: 1,
      },
      { timeout: 100000 }
    );
    const endTime = new Date();
    const stop = new Date().getTime() - startTime.getTime();
    // console.log("stop", stop);
    fs.appendFileSync(
      `./${concurrency}_result.txt`,
      `[${concurrency}, ${halfTime.getTime() - startTime.getTime()}, ${
        endTime.getTime() - halfTime.getTime()
      }, ${stop}, 1]\n`
    );
  } catch (error) {
    console.log(error);
    fs.appendFileSync(
      `./${concurrency}_result.txt`,
      `[${concurrency}, ${0}, 0, 0, 0]\n`
    );
  }
}

main();
