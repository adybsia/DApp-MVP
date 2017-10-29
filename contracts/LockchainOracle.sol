pragma solidity ^0.4.15;

import './Ownable.sol';
import './Pausable.sol';

/**
 * @title LockchainOracle
 * @dev Oracle for the LOC exchange rate
 * Allows setting Wei to LOCwei rate
 */
contract LockchainOracle is Ownable, Pausable {

	bool public isLocOracle = true;

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