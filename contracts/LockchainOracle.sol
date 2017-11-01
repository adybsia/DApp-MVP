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

    uint public rate; // LockWei(18 decimals) per 1000 Wei(21 decimals)
	uint public minWeiAmount = 1000; 

	event LogRateChanged(uint oldRate, uint newRate, address changer);
	event LogMinWeiAmountChanged(uint oldMinWeiAmount, uint newMinWeiAmount, address changer);

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

	function setMinWeiAmount(uint newMinWeiAmount) public onlyOwner whenNotPaused returns(bool) {
		require(newMinWeiAmount > 0);
		uint oldMinWeiAmount = minWeiAmount;
		minWeiAmount = oldMinWeiAmount;
		LogMinWeiAmountChanged(minWeiAmount, oldMinWeiAmount, msg.sender);
		return true;
	}
}