pragma solidity 0.4.17;

import './Pausable.sol';

contract LockchainMVP is Pausable {
    
    struct Booking {
        bytes32 reserverAddressHash;
        uint deadlineRefund;
        uint refundAmount;
        uint costAmount;
        uint bookingArrayIndex;
    }

    uint[] public bookingIds;
    mapping (uint => Booking) Bookings;
    
    function book() public {
        
    }
    
    function cancelBooking() public {
        
        
        refund();
    }
    
    function refund() private {
        
    }
    
    function withdraw() public onlyOwner {
        
    }
    
    function hashAddress() public constant returns(bytes32 addressHash) {
        
    }
}