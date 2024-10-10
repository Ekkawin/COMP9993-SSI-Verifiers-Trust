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
  // const concurrency = Number(process.argv.slice(2)[0]);
  // console.log("con", concurrency);
  // const a = new Array(concurrency).fill(null).map((_, i) => i + 1);
  let good = 0;
  let bad = 0;

  const startTime = new Date();
  try {
    const halfTime = new Date();
    const u = await axios.post(
      `http://localhost:3003/score`,
      {
        holderWallet: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        srcAddress: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
        score: 1,
      },
      { timeout: 100000 }
    );
    const endTime = new Date();
    const stop = new Date().getTime() - startTime.getTime();
    console.log("stop", stop);
    fs.appendFileSync(
      "./result.txt",
      `[${200}, ${halfTime.getTime() - startTime.getTime()}, ${
        endTime.getTime() - halfTime.getTime()
      }, ${stop}, 1]\n`
    );
  } catch (error) {
    console.log(error);
    fs.appendFileSync("./result.txt", `[${200}, ${0}, 0, 0, 0]\n`);
  }
}

main();
