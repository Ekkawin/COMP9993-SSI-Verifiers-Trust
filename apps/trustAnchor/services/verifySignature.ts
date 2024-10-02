import { nullAddress } from "common";
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
  console.log("issuerRegistryAddress", issuerRegistryAddress);

  const issuerRegistry = await ethers.getContractAt(
    "IssuerRegistry",
    issuerRegistryAddress
  );

  const result = await issuerRegistry.verifySignature(
    issuerAddress || nullAddress,
    issuerSignature
  );

  return result;
};
