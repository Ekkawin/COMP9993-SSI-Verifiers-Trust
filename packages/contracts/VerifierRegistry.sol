/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VerifierRegistry {
    mapping(address => address) public owners;
    mapping(address => uint) public contractType;
    address public owner;
    // address[] public verifierAddresses;

    constructor() {
        owner = msg.sender;
    }

    function registerContract(
        address contractAddress,
        uint _contractType
    ) external {
        // TODO: check to existence of the contract address
        owners[contractAddress] = msg.sender;
        contractType[contractAddress] = _contractType;
    }

    function getOwner(address v) external view returns (address) {
        return owners[v];
    }

    function getContractType(address a) external view returns (uint) {
        return contractType[a];
    }

    function getContractOwner(address a) external view returns (address) {
        return owners[a];
    }
}
