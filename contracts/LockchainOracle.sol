pragma solidity ^0.4.15;

import './Ownable.sol';
import './Pausable.sol';

/**
 * @title LockchainAlpha
 * @dev Contract for the Alpha version of the Lockchain service. 
 * Allows for booking properties and withdrawal and refund of reservation
 */
contract LockchainOracle is Ownable, Pausable {
    uint public rate; // Wei(21 decimals) per LockWei(18 decimals)

	event LogRateChanged(uint oldRate, uint newRate, address changer);

	function LockchainOracle(uint initialRate) {
		require(initialRate > 0);
		rate = initialRate;
	}
	

	function rate() public constant whenNotPaused returns(uint) {
		return rate;
	}

	function setRate(uint newRate) public onlyOwner whenNotPaused returns(bool) {
		require(newRate > 0);
		uint oldRate = rate;
		rate = newRate;
		LogRateChanged(oldRate, newRate, msg.sender);
		return true;
	}
}