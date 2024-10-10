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
    const t = await axios.post(
      "http://localhost:3000/verify-trustanchor/0x5cfe05F1EFAaa63CeA30dA3f9Cf98b1D23b1e450"
    );

    const halfTime = new Date();
    const requestId = Number(t?.data?.requestId);
    const u = await axios.post(`http://localhost:3001/verify/${requestId}`, {
      holderWallet: "0xDfB7648432A4E1E1e5Bb3EA964E53E35cbDC7029",
      issuerAddress: "0x5cDCC84473Bb9e7EacbC23B26c2fcdD02E9d5Fe3",
      data: {
        type: "Buffer",
        data: [
          19, 211, 71, 226, 58, 39, 8, 198, 67, 181, 121, 94, 83, 51, 72, 36,
          63, 11, 244, 205, 127, 191, 44, 109, 11, 221, 2, 196, 27, 140, 37,
          109, 233, 5, 124, 181, 241, 126, 59, 105, 81, 197, 1, 51, 65, 151, 5,
          35, 111, 113, 160, 102, 5, 110, 34, 250, 211, 107, 211, 189, 126, 68,
          10, 151, 182, 29, 198, 148, 35, 168, 142, 15, 143, 13, 54, 50, 134,
          191, 253, 136, 173, 252, 4, 121, 62, 217, 132, 123, 16, 59, 105, 57,
          117, 194, 227, 51, 250, 189, 33, 106, 227, 214, 67, 64, 234, 191, 47,
          54, 182, 149, 72, 17, 135, 223, 137, 23, 166, 235, 54, 41, 139, 70,
          198, 248, 155, 69, 139, 168, 136, 9, 19, 98, 168, 41, 53, 6, 251, 193,
          90, 42, 67, 103, 229, 119, 111, 136, 130, 188, 197, 202, 88, 13, 184,
          118, 45, 96, 217, 30, 240, 181, 27, 122, 212, 145, 121, 16, 147, 39,
          111, 2, 47, 81, 125, 113, 193, 131, 236, 152, 239, 43, 140, 201, 55,
          199, 55, 216, 150, 76, 105, 224, 48, 193, 31, 76, 173, 103, 27, 40,
          214, 11, 231, 47, 255, 31, 73, 4, 136, 137, 28, 93, 91, 200, 250, 54,
          31, 13, 174, 96, 204, 21, 245, 168, 72, 37, 235, 116, 182, 123, 9, 0,
          228, 221, 185, 45, 13, 62, 145, 29, 123, 169, 72, 28, 40, 229, 193,
          146, 187, 49, 131, 247, 243, 102, 250, 126, 221, 212, 24, 16, 194, 92,
          22, 44, 62, 244, 142, 158, 137, 40, 228, 137, 190, 181, 209, 71, 168,
          149, 39, 56, 140, 53, 65, 47, 43, 229, 15, 126, 3, 80, 169, 42, 86,
          238, 144, 72, 156, 98, 206, 103, 39, 169, 234, 55, 133, 51, 49, 48, 4,
          99, 209, 255, 93, 211, 81, 222, 253, 177, 47, 94, 10, 15, 223, 48,
          169, 80, 14, 41, 161, 188, 67, 150, 56, 57, 139, 139, 170, 111, 158,
          89, 114, 236, 175, 81, 166, 82, 195, 26, 191, 224, 140, 120, 203, 196,
          69, 106, 39, 212, 175, 129, 254, 228, 100, 241, 213, 173, 170, 224,
          126, 134, 134, 70, 133, 63, 242, 149, 221, 77, 54, 105, 136, 18, 106,
          247, 182, 9, 116, 134, 169, 85, 139, 202, 62, 136, 220, 49, 249, 104,
          186, 90, 248, 134, 142, 143, 148, 140, 45, 245, 33, 167, 87, 138, 212,
          6, 179, 242, 70, 25, 119, 70, 208, 100, 156, 189, 76, 177, 221, 165,
          35, 238, 139, 255, 79, 25, 173, 199, 172, 167, 44, 132, 148, 211, 55,
          41, 74, 238, 59, 130, 90, 36, 20, 104, 212, 79, 90, 117, 255, 78, 96,
          234, 135, 13, 144, 158, 198, 4, 66, 121, 78, 12, 98, 92, 92, 74, 218,
          114, 219, 65, 90, 181, 74, 136, 45, 18, 128, 141, 44, 138, 86, 23, 89,
          243, 129, 66, 155, 198, 50, 231, 123, 238, 155, 25, 162, 99, 106, 38,
          124, 70, 226, 37, 104, 253, 192, 216,
        ],
      },
    });
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
