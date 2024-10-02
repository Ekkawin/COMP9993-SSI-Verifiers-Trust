#!/bin/bash
mkdir contracts
npx hardhat compile
for file in "../../packages/contracts/IssuerRegistry.sol" "../../packages/contracts/Issuer.sol" ; do
    cp $file ./contracts/
done
