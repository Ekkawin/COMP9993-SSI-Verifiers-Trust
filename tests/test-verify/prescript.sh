#!/bin/bash
mkdir contracts

for file in "../../packages/contracts/IssuerRegistry.sol" "../../packages/contracts/VerifierRegistry.sol" "../../packages/contracts/L1VerifierRegistry.sol" "../../packages/contracts/Graph.sol"; do
    cp $file ./contracts/
done
npx hardhat compile
