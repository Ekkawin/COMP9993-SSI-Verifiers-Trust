/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Graph{

mapping(address => address[]) public graph;

// constructor(){
//     }

event LogGraph(address, address);


  function addEdge(address des) public {
    //  .
    //  .  #do something
    //  .
    //   unit256 key = “key example”
    //   unit256 confirmkey =   Verifier.confirmSigningKey(
    //                                                  encryptwithpubkey(key))

    //  if (key === confirmkey) {
      graph[des].push(msg.sender);
    //      }
    // string memory a = string(abi.encodePacked(des));
      emit LogGraph(des, msg.sender);
     
   }
   function getEdge(address src) public returns (address) {
    //  .
    //  .  #do something
    //  .
    //   unit256 key = “key example”
    //   unit256 confirmkey =   Verifier.confirmSigningKey(
    //                                                  encryptwithpubkey(key))

    //  if (key === confirmkey) {
      
    //      }
    // string memory a = string(abi.encodePacked(des));
      emit LogGraph(src, msg.sender);
      return (graph[src][0]);
     
   }
}