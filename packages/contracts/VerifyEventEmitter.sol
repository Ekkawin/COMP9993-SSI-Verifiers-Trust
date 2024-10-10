/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VerifyEventEmitter {
    event TAVerify(address, address, string, string, address);
    event Verify(address, string, string, address);

    constructor() {}

    function emitTAEvent(
        address holder,
        address verifier,
        string memory status,
        string memory message
    ) public {
        emit TAVerify(holder, verifier, status, message, msg.sender);
    }
    function emitVerifyEvent(
        address holder,
        string memory status,
        string memory message
    ) public {
        emit Verify(holder, status, message, msg.sender);
    }
}
