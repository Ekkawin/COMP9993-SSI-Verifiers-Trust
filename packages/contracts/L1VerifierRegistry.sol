/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract L1VerifierRegistry {
    
    address public owner;
    mapping(address => string) public hash;

    event AddHash(address, address);

    constructor() {
        owner = msg.sender;
    }

    event LogGraph(address, address, address);

    function addHash(address root, address newContractAddress) public {

        // TODO: Do checking
        emit AddHash(root, newContractAddress);
        
    }

    function _addHash(address root, string memory _hash) public  onlyOwner{
        hash[root] = _hash;
    }

    function addRoot(address root) public onlyOwner {
        hash[root] = "";
    }


    function getHash(address root) public view returns(string memory){
        return hash[root];
    }

    

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
