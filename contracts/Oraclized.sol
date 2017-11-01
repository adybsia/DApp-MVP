pragma solidity ^0.4.15;

import './Ownable.sol';
import './Pausable.sol';
import './LockchainOracle.sol';

/**
 * @title Oraclized
 * @dev Contract for exchanging LOC to ETH
 * Allows for exchanging LOCwei to wei
 */
contract Oraclized is Ownable, Pausable {
    address public LOCOracle;

	event LOGLOCOracleSet(address oldOracle, address newOracle, address changer);

	function Oraclized(address initialOracle) public {
		require(initialOracle != address(0x0));
		LOCOracle = initialOracle;
		LockchainOracle oracle = LockchainOracle(initialOracle);
		require(oracle.isLocOracle());
	}

	modifier onlyOracle() {
		require(msg.sender == LOCOracle);
		_;
	}

	function setOracle(address newOracle) public onlyOwner whenNotPaused returns(bool) {
		require(newOracle != address(0x0));
		LockchainOracle oracle = LockchainOracle(newOracle);
		require(oracle.isLocOracle());
		address oldOracle = LOCOracle;
		LOCOracle = newOracle;
		LOGLOCOracleSet(oldOracle, newOracle, msg.sender);
		return true;
	}

	function rate() public constant whenNotPaused returns(uint) {
		return LockchainOracle(LOCOracle).rate();
	}

	function minWeiAmount() public constant whenNotPaused returns(uint) {
		return LockchainOracle(LOCOracle).minWeiAmount();
	}
}