const LockchainOracle = artifacts.require("./LockchainOracle.sol");
const util = require('./util');
const expectThrow = util.expectThrow;

contract('LockchainOracle', function(accounts) {

    let LOInstance;

    const _owner = accounts[0];
    const _notOwner = accounts[1];
    const _reserver = accounts[2];

    const _initialRate = 10000;
    const _newRate = 50000;


    describe("constructor", () => {
        beforeEach(async function() {
            LOInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
        })

        it("should have set the owner of the contract", async function() {
            const LOOwner = await LOInstance.owner.call();
            assert.strictEqual(LOOwner, _owner, "The contract owner was not set correctly");
        });

        it("should have set the initial rate correctly", async function() {
            const rate = await LOInstance.rate.call();
            assert(rate.eq(_initialRate), "The initial rate was not set correctly");
        });

    });

    describe("changing rate", () => {

        beforeEach(async function() {
            LOInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
        })

        it("should change the rate correctly", async function() {
            await LOInstance.setRate(_newRate, {
                from: _owner
            });
            const rate = await LOInstance.rate.call();
            assert(rate.eq(_newRate), "The initial rate was not set correctly");
        });

        it("should throw if non-owner tries to change", async function() {
            await expectThrow(LOInstance.setRate(_newRate, {
                from: _notOwner
            }));
        });

        it("should emit event on change", async function() {
            const expectedEvent = 'LogRateChanged';
            let result = await LOInstance.setRate(_newRate, {
                from: _owner
            });
            assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
            assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
        });
    })

    describe("working with paused contract", () => {
        beforeEach(async function() {
            LOInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
        })

        it("should throw if try to get the rate of paused contract", async function() {
            await LOInstance.pause({
                from: _owner
            });
            await expectThrow(LOInstance.rate.call());
        });

        it("should throw if try to change the rate of paused contract", async function() {
            await LOInstance.pause({
                from: _owner
            });
            await expectThrow(LOInstance.setRate(_newRate, {
                from: _owner
            }));
        });
    })



});