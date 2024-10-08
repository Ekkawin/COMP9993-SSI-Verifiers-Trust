/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract TrustAnchor {
    address public owner;

    event TAVerify(address, address, string, string);

    constructor() {
        owner = msg.sender;
    }

   function verify(address holder, address verifier, string memory status, string memory message) external onlyOwner {
        emit TAVerify(holder, verifier, status, message);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
