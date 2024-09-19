/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Issuer.sol";

contract Factory{

    Issuer[] public  _issuers;
    // Verifier[] public  _verifiers;

    function createIssuer() public{
        Issuer issuer = new Issuer();
        _issuers.push(issuer);

    }
    // function createVerifier() public{
    //     Verifier verifier = new Verifier();
    //     _verifiers.push(verifier);

    // }

    function getIssuer() public view returns (address) {
        return address(_issuers[_issuers.length -1]);
    }


    function addIssuerEdge(address src,  address des, uint32 weight) public{
        Issuer(src).addVertex(des);
        Issuer(src).addEdge(weight);
        
    }

    // function addVerifierEdge(address src,  address des, uint32 weight) public{
    //     Verifier(src).addVertex(des);
    //     Verifier(src).addEdge(weight);
        
    // }

    // function getVerifier() public view returns (address) {
    //     return address(_verifiers[_verifiers.length-1]);
    // }

}