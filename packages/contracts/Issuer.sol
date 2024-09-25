/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Issuer {
    address public owner;
    
    event IssueVC(address);

    constructor() {
        owner = msg.sender;
    }

    function issueVC(address callerAddress) external onlyOwner {
        emit IssueVC(callerAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
