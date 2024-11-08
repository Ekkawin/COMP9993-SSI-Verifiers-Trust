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
  const id = Number(process.argv.slice(2)[1]);

  const startTime = new Date();
  try {
    const halfTime = new Date();
    const u = await axios.post(
      `http://20.40.47.79/score?eventNumber=${id}`,
      {
        holderWallet: "0x646aAC94a702628e15a267FB52e5b9C6705EA566",
        srcAddress: "0x41b4fE4F568A39dcebEea642e66Ce0c2727bD1DF",
        score: 1,
      },
      { timeout: 100000 }
    );
    const endTime = new Date();
    const stop = new Date().getTime() - startTime.getTime();
    // console.log("stop", stop);
    fs.appendFileSync(
      `./${concurrency}_result_ganache.txt`,
      `[${concurrency}, ${halfTime.getTime() - startTime.getTime()}, ${
        endTime.getTime() - halfTime.getTime()
      }, ${stop}, 1]\n`
    );
  } catch (error) {
    // console.log(error);
    fs.appendFileSync(
      `./${concurrency}_result_ganache.txt`,
      `[${concurrency}, ${0}, 0, 0, 0]\n`
    );
  }
}

main();
