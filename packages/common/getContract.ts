import { compileSols, writeOutput } from "./solc-lib";
import path from "path";

export const getContract = (name: string, address:string, web3: any) => {
    const buildPath = path.resolve(__dirname, "");
    let compiledContract: any;
    try {
      compiledContract = compileSols([name]);
      writeOutput(compiledContract, buildPath);
    } catch (error) {
      console.error(error);
      throw "Error while compiling contract";
    }
    console.log("Contract compiled");
  
    const contract = new web3.eth.Contract(
      compiledContract.contracts[name][name].abi, address
    );
    return contract;
  };