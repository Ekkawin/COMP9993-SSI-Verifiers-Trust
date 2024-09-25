import { GasHelper } from "./util";
import {
  ETH_DATA_FORMAT,
  DEFAULT_RETURN_FORMAT,
} from "web3";
import { compileSols, writeOutput } from "./solc-lib";
import path from "path";

export const deployContract = async (
    contractName: string,
    from: string,
    web3: any
  ) => {
    
    console.log(from);
    const buildPath = path.resolve(__dirname, "../contracts");
    let compiledContract: any;
    console.log("buildPath", buildPath)
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