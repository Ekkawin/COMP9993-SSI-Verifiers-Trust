import { GasHelper } from "./util";
const {
  Web3,
  ETH_DATA_FORMAT,
  DEFAULT_RETURN_FORMAT,
} = require("web3");
import type { Web3BaseProvider, AbiStruct } from "web3-types";
import { compileSols, writeOutput } from "./solc-lib";

let fs = require("fs");
const path = require("path");

export const initProvider = (): Web3BaseProvider => {
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
  
  export const deployContract = async (
    contractName: string,
    from: string,
    web3: any
  ) => {
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
  export const getAccount = (web3: typeof Web3, name: string) => {
    try {
      const accountData = fs.readFileSync("eth_accounts/accounts.json", "utf8");
      const accountJson = JSON.parse(accountData);
      const accountPvtKey = accountJson[name]["pvtKey"];
  
      // Build an account object given private key
      web3.eth.accounts.wallet.add(accountPvtKey);
    } catch (error) {
      throw "Cannot read account";
    }
  };