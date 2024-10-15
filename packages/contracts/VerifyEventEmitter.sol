/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VerifyEventEmitter {
    uint private eventNumber;
    event TAVerify(
        uint indexed eventNumber,
        address holderAddress,
        address verifierAddress,
        string status,
        string message,
        address callerAddress
    );

    event Verify(
        uint indexed eventNumber,
        address holderAddress,
        string status,
        string message,
        address callerAddress
    );

    event GiveScore(
        uint indexed eventNumber,
        address callerAddress
    );

    constructor() {
        eventNumber = 0;
    }

    function emitTAEvent(
        address holder,
        address verifier,
        address sender,
        string memory status,
        string memory message
    ) external {
        emit TAVerify(eventNumber, holder, verifier, status, message, sender);
        eventNumber = eventNumber + 1;
    }
    function emitVerifyEvent(
        address holder,
        address sender,
        string memory status,
        string memory message
    ) external {
        emit Verify(eventNumber, holder, status, message, sender);
        eventNumber = eventNumber + 1;
    }

    function emitScoringEvent(
        uint _eventNumber,
        address callerAddress
    ) external {
        emit GiveScore(_eventNumber, callerAddress);
    }
}
