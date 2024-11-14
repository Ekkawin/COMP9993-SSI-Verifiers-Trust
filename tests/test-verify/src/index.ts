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
  // const a = new Array(concurrency).fill(null).map((_, i) => i + 1);
  let good = 0;
  let bad = 0;

  const startTime = new Date();
  try {
    const t = await axios.post(
      "http://localhost:3000/verify-trustanchor/0x41b4fE4F568A39dcebEea642e66Ce0c2727bD1DF"
    );

    const halfTime = new Date();
    const requestId = Number(t?.data?.requestId);
    const u = await axios.post(`http://localhost:3001/verify/${requestId}`, {
      holderWallet: "0x646aAC94a702628e15a267FB52e5b9C6705EA566",
      issuerAddress: "0x8EFF2008753D51ecce12AAa5651a6459c1f415d7",
    });
    const endTime = new Date();
    const stop = new Date().getTime() - startTime.getTime();
    // console.log("stop", stop);
    fs.appendFileSync(
      `./${concurrency}_result_ganache_1.txt`,
      `[${concurrency}, ${halfTime.getTime() - startTime.getTime()}, ${
        endTime.getTime() - halfTime.getTime()
      }, ${stop}, 1]\n`
    );
  } catch (error) {
    // console.log(error);
    fs.appendFileSync(
      `./${concurrency}_result_ganache_1.txt`,
      `[${concurrency}, ${0}, 0, 0, 0]\n`
    );
  }
}

main();
