/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract IssuerRegistry{
    mapping(address => string) private signatures;
    address public owner;

    constructor(){
        owner = msg.sender;
    }

    function addSignature(address issuer, string memory signature) external{
        signatures[issuer] = signature;    
    }

    function verifySignature(address issuer, string memory signature) external view returns (bool) {
        return keccak256(abi.encodePacked((signatures[issuer]))) == keccak256(abi.encodePacked((signature)));
        
    }

    function getSignature(address issuer)external view returns (string memory){
        return signatures[issuer];
    }

     modifier onlyOwner {
        require(msg.sender == owner);
        _;
    } 



}