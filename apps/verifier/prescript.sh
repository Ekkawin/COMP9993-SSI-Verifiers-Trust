#!/bin/bash
mkdir contracts
npx hardhat compile
for file in "../../packages/contracts/IssuerRegistry.sol" "../../packages/contracts/Verifier.sol" "../../packages/contracts/VerifierRegistry.sol "../../packages/contracts/VerifyEventEmitter.sol"" ; do
    cp $file ./contracts/
done
