pragma solidity 0.4.17;

import './Ownable.sol';
import './Pausable.sol';
import './tokens/ERC20.sol';

/**
 * @title LockchainAlpha
 * @dev Contract for the Alpha version of the Lockchain service. 
 * Allows for booking properties and withdrawal and refund of reservation
 */
contract LockchainAlpha is Ownable, Pausable {

    struct Reservation {
        address reserverAddress;
        uint costLOC;
        uint refundDeadline;
        uint refundAmountLOC;
        uint bookingArrayIndex;
    }

    function LockchainAlpha(address locTokenContractAddress) public {
        LOCTokenContract = ERC20(locTokenContractAddress);
    }

    ERC20 LOCTokenContract;

    uint[] public bookingIds;
    mapping (uint => Reservation) public bookings;
    

    /**
     * @dev called by the owner of the contract to make a reservation and withdraw LOC from the user account
     * @notice the reservator has to approve enough allowance before calling this
     * @param bookingId - the identifier of the reservation
     * @param reservationCostLOC - the cost of the reservation
     * @param reserverAddress - who is reserving the property
     * @param refundDeadline - the last date the user can ask for refund
     * @param refundAmountLOC - how many tokens the refund is
     */
    function reserve(uint bookingId, 
                    uint reservationCostLOC,
                    address reserverAddress, 
                    uint refundDeadline, 
                    uint refundAmountLOC) 
        public 
        onlyOwner
        whenNotPaused
        returns(bool success)
    {

        bookingIds.push(bookingId);

        bookings[bookingId] = Reservation({
            reserverAddress: reserverAddress,
            costLOC: reservationCostLOC,
            refundDeadline: refundDeadline,
            refundAmountLOC: refundAmountLOC,
            bookingArrayIndex: bookingIds.length
        });

        assert(LOCTokenContract.transferFrom(reserverAddress, msg.sender, reservationCostLOC));

        return true;
    }
    
    function cancelBooking() public {
        refund();
    }
    
    function refund() private {
        
    }
    
    function withdraw() public onlyOwner {
        
    }
    
}