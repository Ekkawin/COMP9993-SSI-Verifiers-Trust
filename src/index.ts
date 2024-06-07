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

const deployFactory = async () => {
  const contractInstance = new web3.eth.Contract(FactoryAbi);
  const factoryContract = contractInstance.deploy({
    data: "608060405234801561001057600080fd5b50611183806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063876a89bc1161005b578063876a89bc146100ef578063b7c3f8b41461011f578063d4321ec51461013b578063f7efada21461014557610088565b8063453827c61461008d57806346657fe91461009757806352556421146100b557806353b6185e146100d3575b600080fd5b610095610175565b005b61009f610208565b6040516100ac91906106d3565b60405180910390f35b6100bd610283565b6040516100ca91906106d3565b60405180910390f35b6100ed60048036038101906100e8919061061f565b6102ff565b005b6101096004803603810190610104919061066e565b6103da565b60405161011691906106ee565b60405180910390f35b6101396004803603810190610134919061061f565b610419565b005b6101436104f4565b005b61015f600480360381019061015a919061066e565b610587565b60405161016c9190610709565b60405180910390f35b6000604051610183906105c6565b604051809103906000f08015801561019f573d6000803e3d6000fd5b5090506001819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6000600180808054905061021c919061073f565b81548110610253577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000806001600080549050610298919061073f565b815481106102cf577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b8273ffffffffffffffffffffffffffffffffffffffff166336b56dfc836040518263ffffffff1660e01b815260040161033891906106d3565b600060405180830381600087803b15801561035257600080fd5b505af1158015610366573d6000803e3d6000fd5b505050508273ffffffffffffffffffffffffffffffffffffffff16639b85e44d826040518263ffffffff1660e01b81526004016103a39190610724565b600060405180830381600087803b1580156103bd57600080fd5b505af11580156103d1573d6000803e3d6000fd5b50505050505050565b600081815481106103ea57600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b8273ffffffffffffffffffffffffffffffffffffffff166336b56dfc836040518263ffffffff1660e01b815260040161045291906106d3565b600060405180830381600087803b15801561046c57600080fd5b505af1158015610480573d6000803e3d6000fd5b505050508273ffffffffffffffffffffffffffffffffffffffff16639b85e44d826040518263ffffffff1660e01b81526004016104bd9190610724565b600060405180830381600087803b1580156104d757600080fd5b505af11580156104eb573d6000803e3d6000fd5b50505050505050565b6000604051610502906105d3565b604051809103906000f08015801561051e573d6000803e3d6000fd5b5090506000819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6001818154811061059757600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6104698061087c83390190565b61046980610ce583390190565b6000813590506105ef81610836565b92915050565b6000813590506106048161084d565b92915050565b60008135905061061981610864565b92915050565b60008060006060848603121561063457600080fd5b6000610642868287016105e0565b9350506020610653868287016105e0565b92505060406106648682870161060a565b9150509250925092565b60006020828403121561068057600080fd5b600061068e848285016105f5565b91505092915050565b6106a081610773565b82525050565b6106af816107bf565b82525050565b6106be816107e3565b82525050565b6106cd816107af565b82525050565b60006020820190506106e86000830184610697565b92915050565b600060208201905061070360008301846106a6565b92915050565b600060208201905061071e60008301846106b5565b92915050565b600060208201905061073960008301846106c4565b92915050565b600061074a826107a5565b9150610755836107a5565b92508282101561076857610767610807565b5b828203905092915050565b600061077e82610785565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600063ffffffff82169050919050565b60006107ca826107d1565b9050919050565b60006107dc82610785565b9050919050565b60006107ee826107f5565b9050919050565b600061080082610785565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b61083f81610773565b811461084a57600080fd5b50565b610856816107a5565b811461086157600080fd5b50565b61086d816107af565b811461087857600080fd5b5056fe608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610409806100606000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806336b56dfc1461005157806378eb1c3d1461006d5780638da5cb5b1461008b5780639b85e44d146100a9575b600080fd5b61006b600480360381019061006691906102e7565b6100c5565b005b610075610183565b6040516100829190610348565b60405180910390f35b6100936101f0565b6040516100a09190610348565b60405180910390f35b6100c360048036038101906100be9190610310565b610214565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461011d57600080fd5b6001819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060016000815481106101c0577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461026c57600080fd5b60028190806001815401808255809150506001900390600052602060002090600891828204019190066004029091909190916101000a81548163ffffffff021916908363ffffffff16021790555050565b6000813590506102cc816103a5565b92915050565b6000813590506102e1816103bc565b92915050565b6000602082840312156102f957600080fd5b6000610307848285016102bd565b91505092915050565b60006020828403121561032257600080fd5b6000610330848285016102d2565b91505092915050565b61034281610363565b82525050565b600060208201905061035d6000830184610339565b92915050565b600061036e82610375565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600063ffffffff82169050919050565b6103ae81610363565b81146103b957600080fd5b50565b6103c581610395565b81146103d057600080fd5b5056fea26469706673582212201b5c518490b91327913e70f8c6ca4cdfa2c5a7c9ccbf880995f5c21cab54ae8064736f6c63430008000033608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610409806100606000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806336b56dfc1461005157806378eb1c3d1461006d5780638da5cb5b1461008b5780639b85e44d146100a9575b600080fd5b61006b600480360381019061006691906102e7565b6100c5565b005b610075610183565b6040516100829190610348565b60405180910390f35b6100936101f0565b6040516100a09190610348565b60405180910390f35b6100c360048036038101906100be9190610310565b610214565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461011d57600080fd5b6001819080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600060016000815481106101c0577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461026c57600080fd5b60028190806001815401808255809150506001900390600052602060002090600891828204019190066004029091909190916101000a81548163ffffffff021916908363ffffffff16021790555050565b6000813590506102cc816103a5565b92915050565b6000813590506102e1816103bc565b92915050565b6000602082840312156102f957600080fd5b6000610307848285016102bd565b91505092915050565b60006020828403121561032257600080fd5b6000610330848285016102d2565b91505092915050565b61034281610363565b82525050565b600060208201905061035d6000830184610339565b92915050565b600061036e82610375565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600063ffffffff82169050919050565b6103ae81610363565b81146103b957600080fd5b50565b6103c581610395565b81146103d057600080fd5b5056fea2646970667358221220b27081e042a0c750e023169859cff93aa7c846825c786457cbc5b227036542c064736f6c63430008000033a2646970667358221220d668a7f15433485254418d04b73541179310d84cb22d0549203ae7e4f9e92e3764736f6c63430008000033",
  });

  // Get current average gas price
  const gasPrice = await web3.eth.getGasPrice(ETH_DATA_FORMAT);
  const gasLimit = await factoryContract.estimateGas(
    { from: "0x2dfA509be001a7aA075558131BEA3D8AB83E7B34" },
    DEFAULT_RETURN_FORMAT // the returned data will be formatted as a bigint
  );
  const tx = await factoryContract.send({
    from: "0x2dfA509be001a7aA075558131BEA3D8AB83E7B34",
    gasPrice,
    gas: GasHelper.gasPay(gasLimit),
  });
  const contractAddress = tx.options.address;

  return contractAddress;
};

async function main() {
  const address = await deployFactory();
  await prisma.factory.create({
    data: {
      address,
    },
  });
}

main();
