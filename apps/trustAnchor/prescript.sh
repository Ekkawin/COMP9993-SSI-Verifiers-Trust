#!/bin/bash
mkdir contracts
npx hardhat compile
for file in "../../packages/contracts/IssuerRegistry.sol" "../../packages/contracts/TrustAnchor.sol" "../../packages/contracts/VerifierRegistry.sol" ; do
    cp $file ./contracts/
done
