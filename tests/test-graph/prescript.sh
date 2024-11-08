#!/bin/bash
mkdir contracts
npx hardhat compile
for file in "../../packages/contracts/IssuerRegistry.sol" "../../packages/contracts/VerifyEventEmitter.sol" "../../packages/contracts/VerifierRegistry.sol" "../../packages/contracts/L1VerifierRegistry.sol" "../../packages/contracts/Graph.sol" "../../packages/contracts/Verifier.sol" "../../packages/contracts/VSP.sol"; do
    cp $file ./contracts/
done
