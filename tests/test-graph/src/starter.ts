import { ethers } from "hardhat";
// import axios from "axios";
import * as fs from "fs";

// const prisma = new PrismaClient();

async function main() {
  const data = fs.readFileSync("../../.dev.txt", "utf-8");

  // const [verifierRegisAddres, issReAddr, _, _a, emitterAddress] =
  //   data.split("\n");
  // console.log(verifierRegisAddres);
  const verifierRegisAddres = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  const emitterAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  const a = new Array(100).fill(null).map((_, i) => i + 1);

  a.map(async () => {
    // const verifierAddress = await ethers.deployContract("Verifier");
    try{
    const _verifierContract = await ethers.getContractFactory("Verifier");
    const verifierAddress = await _verifierContract.deploy(emitterAddress);
    const verifierRegistryContract = await ethers.getContractAt(
      "VerifierRegistry",
      verifierRegisAddres
    );
    console.log(verifierAddress)

    const tx = await verifierRegistryContract.registerContract(
      verifierAddress,
      1
    );
    fs.appendFileSync("./verifier.txt", `${verifierAddress?.target}\n`);
  }catch(_){
    console.log(_)
  }
  });
  a.map(async () => {
    try{
    const _trustAnchorContract = await ethers.getContractFactory("TrustAnchor");
    const trustanchorAddress = await _trustAnchorContract.deploy(emitterAddress);
    const verifierRegistryContract = await ethers.getContractAt(
      "VerifierRegistry",
      verifierRegisAddres
    );

    const tx = await verifierRegistryContract.registerContract(
      trustanchorAddress,
      2
    );
    fs.appendFileSync("./trustanchor.txt", `${trustanchorAddress?.target}\n`);
  }catch(e){
    console.log(e)
  }
  });
}
main();
