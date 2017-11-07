pragma solidity ^0.4.15;

import './Ownable.sol';
import './Pausable.sol';
import './tokens/ERC20.sol';
import './math/SafeMath.sol';

/**
 * @title LockchainAlpha
 * @dev Contract for the Alpha version of the Lockchain service. 
 * Allows for booking properties and withdrawal and refund of reservation
 */
contract LockchainAlpha is Ownable, Pausable {
    using SafeMath for uint256;

    event LogReservation(bytes32 bookingId, address reserverAddress, uint costLOC, uint refundDeadline, uint refundAmountLOC);
    event LogCancelation(bytes32 bookingId, address reserverAddress, uint refundedAmountLOC);
    event LogWithdrawal(bytes32 bookingId, uint withdrawAmountLOC);

    struct Reservation {
        address reserverAddress;
        uint costLOC;
        uint refundDeadline;
        uint refundAmountLOC;
        uint bookingArrayIndex;
        bool isActive;
    }

    function LockchainAlpha(address locTokenContractAddress) public {
        LOCTokenContract = ERC20(locTokenContractAddress);
    }

    ERC20 public LOCTokenContract;

    bytes32[] public bookingIds;
    mapping (bytes32 => Reservation) public bookings;
    

    /**
     * @dev modifier ensuring that the modified method is only called on active reservations
     * @param bookingId - the identifier of the reservation
     */
    modifier onlyActive(bytes32 bookingId) {
        require(bookingId != 0);
        Reservation storage r = bookings[bookingId];
        require(r.isActive);
        _;
    }

    /**
     * @dev modifier ensuring that the modified method is only called by the reserver in the booking
     * @param bookingId - the identifier of the reservation
     */
    modifier onlyReserver(bytes32 bookingId) {
        require(bookingId != 0);
        Reservation storage r = bookings[bookingId];
        require(r.reserverAddress == msg.sender);
        _;
    }

    /**
     * @dev modifier ensuring that the modified method is only executed before the refund deadline
     * @param bookingId - the identifier of the reservation
     */
    modifier onlyBeforeDeadline(bytes32 bookingId) {
        require(bookingId != 0);
        Reservation storage r = bookings[bookingId];
        require(now < r.refundDeadline);
        _;
    }

     /**
     * @dev modifier ensuring that the modified method is only executed after the refund deadline
     * @param bookingId - the identifier of the reservation
     */
    modifier onlyAfterDeadline(bytes32 bookingId) {
        require(bookingId != 0);
        Reservation storage r = bookings[bookingId];
        require(now > r.refundDeadline);
        _;
    }
    
    function reservationsCount() public constant returns(uint) {
        return bookingIds.length;
    }

    /**
     * @dev function to ensure complete unlinking of booking from the mapping and array
     * @notice it swaps the last element with the unlinked one and marks it in the mapping
     * @notice it marks the unlinked element as inactive
     * @param bookingId - the identifier of the reservation
     */
    function unlinkBooking(bytes32 bookingId) private {
        bytes32 lastId = bookingIds[bookingIds.length-1];
        bookingIds[bookings[bookingId].bookingArrayIndex] = lastId;
        bookingIds.length--;
        bookings[lastId].bookingArrayIndex = bookings[bookingId].bookingArrayIndex;
        bookings[bookingId].isActive = false;
    }
    

    /**
     * @dev called by the owner of the contract to make a reservation and withdraw LOC from the user account
     * @notice the reservator has to approve enough allowance before calling this
     * @param bookingId - the identifier of the reservation
     * @param reservationCostLOC - the cost of the reservation
     * @param refundDeadline - the last date the user can ask for refund
     * @param refundAmountLOC - how many tokens the refund is
     */
    function reserve
        (bytes32 bookingId, uint reservationCostLOC, uint refundDeadline, uint refundAmountLOC) 
        public whenNotPaused returns(bool success) 
    {
        require(now < refundDeadline);
        require(!bookings[bookingId].isActive);

        bookings[bookingId] = Reservation({
            reserverAddress: msg.sender,
            costLOC: reservationCostLOC,
            refundDeadline: refundDeadline,
            refundAmountLOC: refundAmountLOC,
            bookingArrayIndex: bookingIds.length,
            isActive: true
        });

        bookingIds.push(bookingId);

        assert(LOCTokenContract.transferFrom(msg.sender, this, reservationCostLOC));

        LogReservation(bookingId, msg.sender, reservationCostLOC, refundDeadline, refundAmountLOC);

        return true;
    }
    
    /**
     * @dev called by the reserver to cancel his/her booking
     * @param bookingId - the identifier of the reservation
     */
    function cancelBooking(bytes32 bookingId) 
        whenNotPaused onlyReserver(bookingId) onlyActive(bookingId) onlyBeforeDeadline(bookingId) public returns(bool) 
    {
        uint locToBeRefunded = bookings[bookingId].refundAmountLOC;
        uint serviceFee = bookings[bookingId].costLOC.sub(locToBeRefunded);
        unlinkBooking(bookingId);
        assert(LOCTokenContract.transfer(bookings[bookingId].reserverAddress, locToBeRefunded));
        if (serviceFee > 0) {
            assert(LOCTokenContract.transfer(owner, serviceFee));
        }
        LogCancelation(bookingId, bookings[bookingId].reserverAddress, locToBeRefunded);
        return true;
    }
    
    /**
     * @dev called by owner to make LOC withdrawal for this reservation
     * @param bookingId - the identifier of the reservation
     */
    function withdraw(bytes32 bookingId) 
        whenNotPaused onlyOwner onlyActive(bookingId) onlyAfterDeadline(bookingId) public returns(bool) 
    {
        uint locToBeWithdrawn = bookings[bookingId].costLOC;
        unlinkBooking(bookingId);
        assert(LOCTokenContract.transfer(owner, locToBeWithdrawn));
        LogWithdrawal(bookingId, locToBeWithdrawn);
        return true;
    }
    
}