/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./VerifierRegistry.sol";

contract Graph {
    enum ContractType {
        Holder,
        Verifier,
        TrustAnchor
    }

    mapping(address => address[]) public graph;
    address public owner;
    address private verifierRegistryAddress;
    ContractType private contractType;

    constructor() {
        owner = msg.sender;
    }

    event LogGraph(address, address, address);

    function addEdge(address src, address des) public {
        ContractType srcContractType = mapContractType(
            VerifierRegistry(verifierRegistryAddress).getContractType(src)
        );
        ContractType desContractType = mapContractType(
            VerifierRegistry(verifierRegistryAddress).getContractType(des)
        );

        require(desContractType != ContractType.Holder);
        require(srcContractType != ContractType.TrustAnchor);
        require(
            !(srcContractType == ContractType.Verifier &&
                desContractType == ContractType.Holder)
        );

        if (desContractType == ContractType.Verifier) {
            address contractOwner = VerifierRegistry(verifierRegistryAddress)
                .getContractOwner(src);
            assert(contractOwner != msg.sender);
        }

        graph[des].push(src);
        emit LogGraph(des, src, msg.sender);
    }

    function getEdges(address src) public view returns (address[] memory) {
        return (graph[src]);
    }

    function mapContractType(uint u) private pure returns (ContractType) {
        if (u == 0) return ContractType.Holder;
        if (u == 1) return ContractType.Verifier;
        if (u == 2) return ContractType.TrustAnchor;

        return ContractType.Holder;
    }

    function addVerifierRegisterAddress(address a) public onlyOwner {
        verifierRegistryAddress = a;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
