/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Verifier{
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

     modifier onlyOwner {
        require(msg.sender == owner);
        _;
    } 



}