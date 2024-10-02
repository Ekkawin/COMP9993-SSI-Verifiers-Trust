import {  nullAddress } from "common";
import Web3 from "web3";
import { Web3BaseProvider } from "web3-types";
import { ethers } from "hardhat";

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

  
  const issuerRegistry = await ethers.getContractAt(
    "IssuerRegistry",
    issuerRegistryAddress,
  );

  const result = await issuerRegistry.verifySignature(
    issuerAddress || nullAddress,
    issuerSignature
  );

  return result;
};
