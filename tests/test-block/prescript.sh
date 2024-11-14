#!/bin/bash
mkdir contracts
for file in "../../packages/contracts/IssuerRegistry.sol" "../../packages/contracts/Verifier.sol" "../../packages/contracts/VerifierRegistry.sol" "../../packages/contracts/Graph.sol" "../../packages/contracts/VSP.sol" "../../packages/contracts/VerifyEventEmitter.sol" ; do
    cp $file ./contracts/
done
npx hardhat compile
