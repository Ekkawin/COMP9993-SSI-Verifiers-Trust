/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract VerifyEventEmitter {
    uint private eventNumber;

    event UpdateGraph(
        address indexed srcAddress,
        address indexed desAddress,
        address callerAddress
    );

    event VSPVerify(
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

    function emitUpdateGraphEvent(
        address srcAddress,
        address desAddress,
        address callerAddress
    ) external {
        emit UpdateGraph(srcAddress, desAddress, callerAddress);
    }
    function emitVSPEvent(
        address holder,
        address verifier,
        address sender,
        string memory status,
        string memory message
    ) external {
        emit VSPVerify(eventNumber, holder, verifier, status, message, sender);
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
