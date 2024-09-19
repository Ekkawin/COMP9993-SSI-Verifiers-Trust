/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Issuer{
    address public owner;
    address[] private vertices;
    uint32[] private edges;


    constructor(){
        owner = msg.sender;
    }

    function addVertex(address v) external onlyOwner {
        vertices.push(v);
    }

     function addEdge(uint32 e) external onlyOwner {
        edges.push(e);
    }

    function getV() public view returns (address){
        return vertices[0];
    }

    function getAddr() public view returns (address){
        address addr = address(bytes20(keccak256(abi.encodePacked(block.timestamp))));
        return addr;
    }

    function hash(string memory data) public pure returns (bytes32) {
    return keccak256(abi.encode(data));
}

     modifier onlyOwner {
        require(msg.sender == owner);
        _;
    } 



}