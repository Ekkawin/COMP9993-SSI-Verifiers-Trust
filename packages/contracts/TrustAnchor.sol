/// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "./VerifyEventEmitter.sol";

contract TrustAnchor {
    address public owner;
    address public emitterAddress;

    constructor(address _emitterAddress) {
        owner = msg.sender;
        emitterAddress = _emitterAddress;
    }

    function verify(
        address holder,
        address verifier,
        string memory status,
        string memory message
    ) external onlyOwner {
        VerifyEventEmitter(emitterAddress).emitTAEvent(
            holder,
            verifier,
            address(this),
            status,
            message
        );
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
