/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Verifier {
    address public owner;
    
    event Verify(address, string, string);
    event VerifyViaTA(address, address);

    constructor() {
        owner = msg.sender;
    }

    function verify(address src, string memory status, string memory message) external onlyOwner {
        emit Verify(src, status, message);
    }

    function verifyViaTa(address src, address ta) external onlyOwner {
        emit VerifyViaTA(src, ta);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
