import { compileSols, writeOutput } from "./solc-lib";
import path from "path";
import * as fs from "fs";

export const getContract = (name: string, address: string, web3: any) => {
  const buildPath = path.resolve(__dirname, "../contracts");
  let compiledContract: any;

  try {
    compiledContract = compileSols([name]);
    if (!fs.existsSync(`${buildPath}/${name}.json`)) {
      writeOutput(compiledContract, buildPath);
    }
  } catch (error) {
    console.error(error);
    throw "Error while compiling contract";
  }
  console.log("Contract compiled");

  const contract = new web3.eth.Contract(
    compiledContract.contracts[name][name].abi,
    address
  );
  return contract;
};
