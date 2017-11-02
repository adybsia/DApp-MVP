const LockchainOracle = artifacts.require("./LockchainOracle.sol");
const util = require('./util');
const expectThrow = util.expectThrow;

contract('LockchainOracle', function(accounts) {

    let LockchainOracleInstance;

    const _owner = accounts[0];
    const _notOwner = accounts[1];

    const _initialRate = 10000;
    const _newRate = 50000;
    const _newMinWeiAmount = 2000;


    describe("constructor", () => {
        beforeEach(async function() {
            LockchainOracleInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
        })

        it("should have set the owner of the contract", async function() {
            const LockchainOracleOwner = await LockchainOracleInstance.owner.call();
            assert.strictEqual(LockchainOracleOwner, _owner, "The contract owner was not set correctly");
        });

        it("should have set the initial rate correctly", async function() {
            const rate = await LockchainOracleInstance.rate.call();
            assert(rate.eq(_initialRate), "The initial rate was not set correctly");
        });

        it("should have been set as oracle", async function() {
            const isOracle = await LockchainOracleInstance.isLocOracle.call();
            assert.isTrue(isOracle, "The initial oracle is not a real Oracle");
        });

    });

    describe("changing rate", () => {
        beforeEach(async function() {
            LockchainOracleInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
        });

        it("should change the rate correctly", async function() {
            await LockchainOracleInstance.setRate(_newRate, {
                from: _owner
            });
            const rate = await LockchainOracleInstance.rate.call();
            assert(rate.eq(_newRate), "The initial rate was not set correctly");
        });

        it("should throw if non-owner tries to change", async function() {
            await expectThrow(LockchainOracleInstance.setRate(_newRate, {
                from: _notOwner
            }));
        });

        it("should emit event on change", async function() {
            const expectedEvent = 'LogRateChanged';
            let result = await LockchainOracleInstance.setRate(_newRate, {
                from: _owner
            });
            assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
            assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
        });
    });

    describe("changing minWeiAmount", () => {
        beforeEach(async function() {
            LockchainOracleInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
        });

        it("should change the minWeiAmount correctly", async function() {
            await LockchainOracleInstance.setMinWeiAmount(_newMinWeiAmount, {
                from: _owner
            });
            const minWeiAmount = await LockchainOracleInstance.minWeiAmount.call();
            assert(minWeiAmount.eq(_newMinWeiAmount), "The initial minWeiAmount was not set correctly");
        });

        it("should throw if non-owner tries to change", async function() {
            await expectThrow(LockchainOracleInstance.setMinWeiAmount(_newRate, {
                from: _notOwner
            }));
        });

        it("should emit event on change", async function() {
            const expectedEvent = 'LogMinWeiAmountChanged';
            let result = await LockchainOracleInstance.setMinWeiAmount(_newMinWeiAmount, {
                from: _owner
            });
            assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setMinWeiAmount!");
            assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
        });
    });

    describe("working with paused contract", () => {
        beforeEach(async function() {
            LockchainOracleInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
        })

        it("should throw if try to get the rate of paused contract", async function() {
            await LockchainOracleInstance.pause({
                from: _owner
            });
            await expectThrow(LockchainOracleInstance.rate.call());
        });

        it("should throw if try to change the rate of paused contract", async function() {
            await LockchainOracleInstance.pause({
                from: _owner
            });
            await expectThrow(LockchainOracleInstance.setRate(_newRate, {
                from: _owner
            }));
        });

        it("should throw if try to change the minWeiAmount of paused contract", async function() {
            await LockchainOracleInstance.pause({
                from: _owner
            });
            await expectThrow(LockchainOracleInstance.setMinWeiAmount(_newMinWeiAmount, {
                from: _owner
            }));
        });
    })
});