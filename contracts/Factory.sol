/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Issuer.sol";

contract Factory{

    Issuer[] public  _issuers;

    function createIssuer() public{
        Issuer issuer = new Issuer();
        _issuers.push(issuer);

    }

    function getIssuer() public view returns (address) {
        return address(_issuers[0]);
    }

    function addIssuerVertex(address src, address des) public{
        Issuer(src).addVertex(des);
        
    }

    function addIssuerEdge(address src, uint32 weight) public{
        Issuer(src).addEdge(weight);
        
    }

}