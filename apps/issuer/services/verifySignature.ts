import { getAccount, getContract, initProvider, nullAddress } from "common";
import Web3 from "web3";
import { Web3BaseProvider } from "web3-types";

export const verifySignature = async ({
  issuerRegistryAddress = "",
  issuerAddress = "",
  issuerSignature = "",
}: {
  issuerRegistryAddress: string;
  issuerAddress?: string;
  issuerSignature?: string;
}) => {
  let web3Provider: Web3BaseProvider;
  let web3: Web3;

  console.log("issuerRegistryAddress", issuerRegistryAddress);

  try {
    web3Provider = initProvider();
    web3 = new Web3(web3Provider);
  } catch (error) {
    console.error(error);
    throw "Web3 cannot be initialised.";
  }
  getAccount(web3, "acc0");

  const issuerRegistry = getContract(
    "IssuerRegistry",
    issuerRegistryAddress,
    web3
  );

  const contract = issuerRegistry.methods.verifySignature(
    issuerAddress || nullAddress,
    issuerSignature
  );
  const from = web3.eth.accounts.wallet[0].address;
  const result = await contract.call({ from });

  return result;
};
