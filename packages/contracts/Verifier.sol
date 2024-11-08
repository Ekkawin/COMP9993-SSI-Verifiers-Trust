/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./VerifyEventEmitter.sol";

contract Verifier {
    address public owner;
    address public emitterAddress;
    address public contractAddress;

    event VerifyViaVSP(address, address);

    constructor(address _emitterAddress) {
        owner = msg.sender;
        emitterAddress = _emitterAddress;
        contractAddress = address(this);
    }

    function verify(
        address src,
        string memory status,
        string memory message
    ) external onlyOwner {
        VerifyEventEmitter(emitterAddress).emitVerifyEvent(
            src,
            contractAddress,
            status,
            message
        );
    }

    function verifyViaVSP(address src, address ta) external onlyOwner {
        emit VerifyViaVSP(src, ta);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
