const LockchainAlpha = artifacts.require("./LockchainAlpha.sol");
const MintableToken = artifacts.require("./tokens/MintableToken.sol");
const util = require('./util');
const expectThrow = util.expectThrow;
const getTimestampPlusSeconds = util.getTimestampPlusSeconds;

contract('LockchainAlpha', function (accounts) {

  let LAInstance;
  let ERC20Instance;

  const _owner = accounts[0];
  const _notOwner = accounts[1];
  const _reserver = accounts[2];

  const _reservationCost = 50;
  const _reservationRefundAmountLess = _reservationCost - 10;
  const _reservationRefundAmountEqual = _reservationCost;
  const _reserverAmountEnough = _reservationCost * 2;
  const _reserverAmountNotEnough = _reservationCost / 2;

  const _reservationBookingId = "5a9d0e1a87";

  xdescribe("constructor", () => {
    beforeEach(async function () {
      ERC20Instance = await MintableToken.new({
        from: _owner
      });
      LAInstance = await LockchainAlpha.new(ERC20Instance.address, {
        from: _owner
      });
    })

    it("should have set the owner of the contract", async function () {
      const LAOwner = await LAInstance.owner.call();
      assert.strictEqual(LAOwner, _owner, "The contract owner was not set correctly");
    });

    it("should have set the token contract", async function () {
      const LAERC20Address = await LAInstance.LOCTokenContract.call();
      assert.strictEqual(LAERC20Address, ERC20Instance.address, "The token contract was not set correctly");
    });

  });

  describe("reserving correct amount", () => {

    let reservationTimestamp;

    beforeEach(async function () {
      ERC20Instance = await MintableToken.new({
        from: _owner
      });
      LAInstance = await LockchainAlpha.new(ERC20Instance.address, {
        from: _owner
      });
      await ERC20Instance.mint(_reserver, _reserverAmountEnough, {
        from: _owner
      });
      await ERC20Instance.approve(LAInstance.address, _reserverAmountEnough, {
        from: _reserver
      })
      reservationTimestamp = getTimestampPlusSeconds(30);
    })

    it("should make reservation succesfully", async function () {
      let result = await LAInstance.reserve.call(_reservationBookingId, _reservationCost, _reserver, reservationTimestamp, _reservationRefundAmountLess, {
        from: _owner
      });

      assert.isTrue(result, "The reservation was not successful");
    })

    it("should set the values in a reservation correctly", async function () {
      await LAInstance.reserve(_reservationBookingId, _reservationCost, _reserver, reservationTimestamp, _reservationRefundAmountLess, {
        from: _owner
      });
      let result = await LAInstance.bookings.call(_reservationBookingId);
      assert.strictEqual(result[0], _reserver, "The reserver was not set correctly");
      assert(result[1].eq(_reservationCost), "The cost was not set correctly");
      assert(result[2].eq(reservationTimestamp), "The deadline was not set correctly");
      assert(result[3].eq(_reservationRefundAmountLess), "The refund amount was not set correctly");
      assert(result[4].eq(0), "The index array was not set correctly");
      assert.isTrue(result[5], "The reservation was not active");
    })

    xit("should append to the indexes array and set the last element correctly", async function () {})

    xit("should change the LOC balances correctly", async function () {})

    it("should throw if non-owner tries to reserve", async function () {
      await expectThrow(LAInstance.reserve(_reservationBookingId, _reservationCost, _reserver, reservationTimestamp, _reservationRefundAmountLess, {
        from: _notOwner
      }));
    })

    xit("should throw if trying to reserve when paused", async function () {})
    xit("should throw if the deadline is in the past", async function () {})
    xit("should throw if the same booking id is used twice", async function () {})


    it("should emit event on reservation", async function () {
      const expectedEvent = 'LogReservation';
      let result = await LAInstance.reserve(_reservationBookingId, _reservationCost, _reserver, reservationTimestamp, _reservationRefundAmountLess, {
        from: _owner
      });
      assert.lengthOf(result.logs, 1, "There should be 1 event emitted from reservation!");
      assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
    });


  })

  describe("reserving without correct amount", () => {

  })

});
