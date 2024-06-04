/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Verifier{
    string public name;
    address public owner;


    constructor(address _owner){
        // name = _name;
        owner = _owner;
    }
}