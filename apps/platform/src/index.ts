// import { PrismaClient } from "@prisma/client";
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
import { compileSols, writeOutput } from "./solc-lib";
import { log } from "console";
let fs = require("fs");
const path = require("path");

// const prisma = new PrismaClient();

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



// const deployGraph = async () => {

//   const buildPath = path.resolve(__dirname, '')
//   let compiledContract: any
//     try {
//         compiledContract = compileSols(['Graph'])
//         writeOutput(compiledContract, buildPath)
//     } catch (error) {
//         console.error(error)
//         throw 'Error while compiling contract'
//     }
//     console.log('Contract compiled')

//     const graphContractInstance = new web3.eth.Contract(compiledContract.contracts['Graph']['Graph'].abi)
//     const data = compiledContract.contracts['Graph']['Graph'].evm.bytecode.object
//     const graphContract = graphContractInstance.deploy({data});

//   const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
//   const gasLimit = await graphContract.estimateGas(
//     { from: "0x48F9f9b84Fb2758858a9957F9d97a3284BE4b11b" },
//     DEFAULT_RETURN_FORMAT // the returned data will be formatted as a bigint
//   );
//   const tx = await graphContract.send({
//     from: "0x48F9f9b84Fb2758858a9957F9d97a3284BE4b11b",
//     gasPrice,
//     gas: GasHelper.gasPay(gasLimit),
//   });
//   const contractAddress = tx.options.address;

//   const subscriptionDeliveryStatus = await graphContractInstance.events.LogGraph()
//     subscriptionDeliveryStatus.on('data', (event: any) => {
//         const graphData = event.returnValues.status
//         console.log("envent", event)
//         console.log(`Event DeliveryStatus received with status: ${graphData}`)
//     })

//   return contractAddress;
// };

// const deployVerifierRegistry = async () => {

//   const buildPath = path.resolve(__dirname, '')
//   let compiledContract: any
//     try {
//         compiledContract = compileSols(['VerifierRegistry'])
//         writeOutput(compiledContract, buildPath)
//     } catch (error) {
//         console.error(error)
//         throw 'Error while compiling contract'
//     }
//     console.log('Contract compiled')

//     const verifierRegistryContractInstance = new web3.eth.Contract(compiledContract.contracts['VerifierRegistry']['VerifierRegistry'].abi)
//     const data = compiledContract.contracts['VerifierRegistry']['VerifierRegistry'].evm.bytecode.object
//     const verifierRegistryContract = verifierRegistryContractInstance.deploy({data});

//   const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
//   const gasLimit = await verifierRegistryContract.estimateGas(
//     { from: "0x48F9f9b84Fb2758858a9957F9d97a3284BE4b11b" },
//     DEFAULT_RETURN_FORMAT // the returned data will be formatted as a bigint
//   );
//   const tx = await verifierRegistryContract.send({
//     from: "0x48F9f9b84Fb2758858a9957F9d97a3284BE4b11b",
//     gasPrice,
//     gas: GasHelper.gasPay(gasLimit),
//   });
//   const contractAddress = tx.options.address;

//   return contractAddress;
// };

const deployContract = async (contractName: string, from: string,  web3:any) => {
  console.log("hi");
  console.log(from);
  const buildPath = path.resolve(__dirname, "");
  let compiledContract: any;
  try {
    compiledContract = compileSols([contractName]);
    writeOutput(compiledContract, buildPath);
  } catch (error) {
    console.error(error);
    throw "Error while compiling contract";
  }
  console.log("Contract compiled");

  const contractInstance = new web3.eth.Contract(
    compiledContract.contracts[contractName][contractName].abi
  );
  const data =
    compiledContract.contracts[contractName][contractName].evm.bytecode.object;
  const contract = contractInstance.deploy({ data });

  const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
  const gasLimit = await contract.estimateGas(
    { from },
    DEFAULT_RETURN_FORMAT // the returned data will be formatted as a bigint
  );
  const tx = await contract.send({
    from,
    gasPrice,
    gas: GasHelper.gasPay(gasLimit),
  });
  const contractAddress = tx.options.address;

  return contractAddress;
};


async function main() {
  let web3Provider: Web3BaseProvider;
  let web3: typeof Web3;
  
  try {
    web3Provider = initProvider();
    web3 = new Web3(web3Provider);
  } catch (error) {
    console.error(error);
    throw "Web3 cannot be initialised.";
  }

  const from = web3.eth.accounts.wallet;
  console.log(from)
  // const address = await deployGraph();
  // console.log(web3.eth.accounts.wallet[0].address)
  // const graphAddress = deployContract(
  //   "Graph",
  //   web3.eth.accounts.wallet[0].address
  // );
  // console.log("Deploy Graph Smart Contract with Address", graphAddress);

  // const verifierAddress = deployContract('VerifierRegistry', web3.eth.accounts.wallet[0].address )
  // console.log("Deploy Graph Smart Contract with Address", graphAddress);

  // await prisma.factory.create({
  //   data: {
  //     address,
  //   },
  // });

  console.log("Add Factory Contract to Database");
}

main();
