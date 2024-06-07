import { PrismaClient } from "@prisma/client";
import seed from "./seed.json";
import FactoryAbi from "./FactoryAbi.json";
import { GasHelper } from "./util";

const {
  Web3,
  ETH_DATA_FORMAT,
  DEFAULT_RETURN_FORMAT,
  Contract,
} = require("web3");
import type { Web3BaseProvider, AbiStruct } from "web3-types";
let fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const initProvider = (): Web3BaseProvider => {
  try {
    const providerData = fs.readFileSync(
      "eth_providers/providers.json",
      "utf8"
    );
    const providerJson = JSON.parse(providerData);

    //Enable one of the next 2 lines depending on Ganache CLI or GUI
    const providerLink = providerJson["provider_link_ui"];
    // const providerLink = providerJson['provider_link_cli']

    return new Web3.providers.WebsocketProvider(providerLink);
  } catch (error) {
    throw "Cannot read provider";
  }
};

let web3Provider: Web3BaseProvider;
let web3: typeof Web3;

try {
  web3Provider = initProvider();
  web3 = new Web3(web3Provider);
} catch (error) {
  console.error(error);
  throw "Web3 cannot be initialised.";
}

const generateIssuer = async () => {
  const factoryAddress = await prisma.factory.findFirst();
  //   console.log("fact affr", factoryAddress);

  const factoryContract = new web3.eth.Contract(
    FactoryAbi,
    factoryAddress?.address
  );
  const createIssuerFunc = factoryContract.methods.createIssuer();

  const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
  const gasLimit = await createIssuerFunc.estimateGas(
    { from: "0x2dfA509be001a7aA075558131BEA3D8AB83E7B34" },
    DEFAULT_RETURN_FORMAT // the returned data will be formatted as a bigint
  );

  await createIssuerFunc.send({
    from: "0x2dfA509be001a7aA075558131BEA3D8AB83E7B34",
    gasPrice,
    gas: GasHelper.gasPay(gasLimit),
  });
  const issuerAddress = await factoryContract.methods.getIssuer().call();
  console.log("Issuer Address", issuerAddress);

  await prisma.node.create({
    data: {
      id: issuerAddress,
      type: "I",
    },
  });
};

const generateVerifier = async () => {
  const factoryAddress = await prisma.factory.findFirst();
  //   console.log("fact affr", factoryAddress);

  const factoryContract = new web3.eth.Contract(
    FactoryAbi,
    factoryAddress?.address
  );
  const createVerifierFunc = factoryContract.methods.createVerifier();

  const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
  const gasLimit = await createVerifierFunc.estimateGas(
    { from: "0x2dfA509be001a7aA075558131BEA3D8AB83E7B34" },
    DEFAULT_RETURN_FORMAT // the returned data will be formatted as a bigint
  );

  await createVerifierFunc.send({
    from: "0x2dfA509be001a7aA075558131BEA3D8AB83E7B34",
    gasPrice,
    gas: GasHelper.gasPay(gasLimit),
  });
  const verifierAddress = await factoryContract.methods.getVerifier().call();
  console.log("Verifier Address", verifierAddress);

  await prisma.node.create({
    data: {
      id: verifierAddress,
      type: "V",
    },
  });
};

async function main() {
  // generateIssuer()
 
      await generateIssuer();
      await generateIssuer();
      await generateIssuer();
      await generateIssuer();
      await generateIssuer();

      await generateVerifier();
      await generateVerifier();
      await generateVerifier();
      await generateVerifier();
      await generateVerifier();
  //   await Promise.all([1, 2, 3, 4, 5].map(generateVerifier));

  //   await prisma.factory.create({
  //     data: {
  //       address,
  //     },
  //   });
}

main();
