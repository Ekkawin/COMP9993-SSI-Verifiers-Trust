/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VerifyEventEmitter {
    event TAVerify(address, address, string, string);
    event Verify(address, string, string);

    constructor() {}

    function emitTAEvent(
        address holder,
        address verifier,
        string memory status,
        string memory message
    ) external   {
        emit TAVerify(holder, verifier, status, message);
    }
    function emitVerifyEvent(
        address holder,
        string memory status,
        string memory message
    ) external   {
        emit Verify(holder, status, message);
    }
}
