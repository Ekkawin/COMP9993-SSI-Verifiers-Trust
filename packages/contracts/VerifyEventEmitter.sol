/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VerifyEventEmitter {
    event TAVerify(address, address, string, string, address);
    event Verify(address, string, string, address);

    constructor() {}

    function emitTAEvent(
        address holder,
        address verifier,
        address sender,
        string memory status,
        string memory message
    ) external {
        emit TAVerify(holder, verifier, status, message, sender);
    }
    function emitVerifyEvent(
        address holder,
        address sender,
        string memory status,
        string memory message
    ) external {
        emit Verify(holder, status, message, sender);
    }
}
