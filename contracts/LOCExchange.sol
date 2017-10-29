pragma solidity ^0.4.15;

import './Ownable.sol';
import './Pausable.sol';
import './Oraclized.sol';
import './math/SafeMath.sol';

/**
 * @title LOCExchange
 * @dev Contract for exchanging LOC to ETH
 * Allows for exchanging LOCwei to wei
 */
contract LOCExchange is Ownable, Pausable, Oraclized {
    function LOCExchange(address initialOracle) Oraclized(initialOracle) public {}
}