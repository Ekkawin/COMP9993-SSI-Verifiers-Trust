import { deployContract, getAccount, initProvider } from "common";
import { Web3 } from "web3";
import type { Web3BaseProvider } from "web3-types";
import { PrismaClient } from "@prisma/client";
import * as fs from 'fs'

const prisma = new PrismaClient();

let web3Provider: Web3BaseProvider;
let web3: Web3;

try {
  web3Provider = initProvider();
  web3 = new Web3(web3Provider);
} catch (error) {
  console.error(error);
  throw "Web3 cannot be initialised.";
}
getAccount(web3, "acc0");

const from = web3.eth.accounts.wallet[0].address;

async function main() {
  const graphAddress = await deployContract("Graph", from, web3);
  const verifierRegistryAddress = await deployContract(
    "VerifierRegistry",
    from,
    web3
  );
  const issuerRegistryAddress = await deployContract(
    "IssuerRegistry",
    from,
    web3
  );
  const l1VerifierAddress = await deployContract(
    "L1VerifierRegistry",
    from,
    web3
  );

  await prisma.platformContractAddress.create({
    data: {
      graphContractAddress: graphAddress,
      verifierRegistryAddress,
      issuerRegistryAddress,
      lVerifierAddress: l1VerifierAddress,
    },
  });
  const data = verifierRegistryAddress + "\n" + issuerRegistryAddress;

  fs.writeFileSync("../../.dev.txt", data);
}
main()