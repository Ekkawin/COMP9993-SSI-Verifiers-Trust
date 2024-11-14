import { ethers } from "hardhat";
// import axios from "axios";
import * as fs from "fs";

// const prisma = new PrismaClient();

async function main() {
  const data = fs.readFileSync("../../.dev.txt", "utf-8");

  // const [verifierRegisAddres, issReAddr, _, _a, emitterAddress] =
  //   data.split("\n");
  // console.log(verifierRegisAddres);
  const verifierRegisAddres = "0xc752A6c823CC206C394389200eB34C07EaaDc03d"
  const emitterAddress = "0x67CCFa83C0740Ea57C2552cb3a2f06bffE291D30"
  const a = new Array(50).fill(null).map((_, i) => i + 1);

  a.map(async () => {
    // const verifierAddress = await ethers.deployContract("Verifier");
    try{
    const _verifierContract = await ethers.getContractFactory("Verifier");
    const verifierAddress = await _verifierContract.deploy(emitterAddress);
    const verifierRegistryContract = await ethers.getContractAt(
      "VerifierRegistry",
      verifierRegisAddres
    );
    // console.log(verifierAddress)

    const tx = await verifierRegistryContract.registerContract(
      verifierAddress,
      1
    );
    fs.appendFileSync("./verifier.txt", `${verifierAddress?.target}\n`);
  }catch(_){
    // console.log("error in ",_)
    console.log("error in ver")
  }
  });
  a.map(async () => {
    try{
    const _trustAnchorContract = await ethers.getContractFactory("VSP");
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
    console.log("error in ta")
    // console.log("ta error",e)
  }
  });
}
main();
