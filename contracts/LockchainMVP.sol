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
    mapping (uint => Booking) bookings;
    
    function LockchainMVP() {

    }

    function book(uint bookingId, 
                  bytes32 reserverAddressHash, 
                  uint deadlineRefund, 
                  uint refundAmount, 
                  uint costAmount) 
                  public 
                  returns(bool success)
    {
        bookingIds.push(bookingId);
        
        bookings[bookingId] = Booking({
            reserverAddressHash: reserverAddressHash,
            deadlineRefund: deadlineRefund,
            refundAmount: refundAmount,
            costAmount: costAmount,
            bookingArrayIndex: bookingIds.length
        });

        return true;
    }
    
    function cancelBooking() public {
        
        
        refund();
    }
    
    function refund() private {
        
    }
    
    function withdraw() public onlyOwner {
        
    }
    
    function hashAddress(address addressToHash) public constant returns(bytes32 addressHash) {
        return keccak256(addressToHash);
    }
}