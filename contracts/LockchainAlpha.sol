pragma solidity 0.4.17;

import './Ownable.sol';
import './Pausable.sol';
import './tokens/ERC20.sol';

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
    
    function hashAddress(address addressToHash) public constant returns(bytes32 addressHash) {
        return keccak256(addressToHash);
    }
}