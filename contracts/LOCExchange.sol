pragma solidity ^0.4.15;

import './Ownable.sol';
import './Pausable.sol';
import './Oraclized.sol';
import './Destructible.sol';
import './math/SafeMath.sol';

/**
 * @title LOCExchange
 * @dev Contract for exchanging LOC to ETH
 * Allows for exchanging LOCwei to wei
 */
contract LOCExchange is Ownable, Pausable, Destructible, Oraclized {

    event LogLocExchanged(uint LocWei, uint ETHwei, uint rate);
    event LogLocWithdrawal(uint LocWei);

    function LOCExchange(address initialOracle) Oraclized(initialOracle) public {}

    function weiToLocWei(uint weiAmount) constant public whenNotPaused returns(uint) {
        // Function used to find out how much Loc must be approved/allowed to get certain amount of wei
    } 

    function exchange(uint LocWei) public whenNotPaused returns(uint) {
        // Transfer to this contract certain amount of LOCWei and send back wei to the message sender
    }

    function withdrawLOC(uint LocWeiWithdrawAmount) public whenNotPaused onlyOwner returns(uint) {
        // Send given amount of LOC from this contract to the owner
    }

    function getLocBalance() constant public returns(uint) {
        // Get the loc balance from the LOC token contract
    }
}