import { ethers } from "hardhat";
import { PrismaClient } from "@prisma/client";
import * as fs from 'fs'

const prisma = new PrismaClient();

async function main() {
  const graphContract = await ethers.deployContract("Graph");
  const verifierRegistryContract = await ethers.deployContract(
    "VerifierRegistry"
  );
  const issuerRegistryContract = await ethers.deployContract("IssuerRegistry");
  const l1VerifierContract = await ethers.deployContract("L1VerifierRegistry");

  // await prisma.platformContractAddress.deleteMany({});

  // await prisma.platformContractAddress.create({
  //   data: {
  //     graphContractAddress: String(graphContract?.target),
  //     verifierRegistryAddress: String(verifierRegistryContract?.target),
  //     issuerRegistryAddress: String(issuerRegistryContract?.target),
  //     lVerifierAddress: String(l1VerifierContract?.target),
  //   },
  // });
  const data = String(verifierRegistryContract?.target) + "\n" + String(issuerRegistryContract?.target) + "\n"+ String(graphContract?.target) + "\n" + String(l1VerifierContract?.target);

  fs.writeFileSync("../../.dev.txt", data);
}
main();
