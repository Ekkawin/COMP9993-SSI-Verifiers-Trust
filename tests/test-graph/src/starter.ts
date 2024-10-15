import { ethers } from "hardhat";
// import axios from "axios";
import * as fs from "fs";

// const prisma = new PrismaClient();

async function main() {
  const data = fs.readFileSync("../../.dev.txt", "utf-8");

  const [verifierRegisAddres] = data.split("\n");
  console.log(verifierRegisAddres);
  const a = new Array(100).fill(null).map((_, i) => i + 1);

  a.map(async () => {
    const verifierAddress = await ethers.deployContract("Verifier");
    const verifierRegistryContract = await ethers.getContractAt(
      "VerifierRegistry",
      verifierRegisAddres
    );

    const tx = await verifierRegistryContract.registerContract(
      verifierAddress,
      1
    );
    fs.appendFileSync(
      "./verifier.txt",`${verifierAddress?.target}\n`)
  });
  a.map(async () => {
    const trustanchorAddress = await ethers.deployContract("TrustAnchor");
    const verifierRegistryContract = await ethers.getContractAt(
      "VerifierRegistry",
      verifierRegisAddres
    );

    const tx = await verifierRegistryContract.registerContract(
      trustanchorAddress,
      2
    );
    fs.appendFileSync(
      "./trustanchor.txt",`${trustanchorAddress?.target}\n`)
  });
}
main();
