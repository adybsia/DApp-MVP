const LOCExchange = artifacts.require("./LOCExchange.sol");
const LockchainOracle = artifacts.require("./LockchainOracle.sol");
const util = require('./util');
const expectThrow = util.expectThrow;

contract('Oraclized', function(accounts) {

    let LEInstance;
    let LOInstance;

    const _owner = accounts[0];
    const _notOwner = accounts[1];
    const _oracle = accounts[2];
    const _newOracle = accounts[3];

    const _initialRate = 10000;

    describe("constructor", () => {
        beforeEach(async function() {
            LOInstance = await LockchainOracle.new(_initialRate, {
                from: _oracle
            });
            LEInstance = await LOCExchange.new(LOInstance.address, {
                from: _owner
            });
        })

        it("should have set the oracle of the contract", async function() {
            const LEOracle = await LEInstance.LOCOracle.call();
            assert.strictEqual(LEOracle, LOInstance.address, "The contract oracle was not set correctly");
        });

    });

    describe("changing the oracle", () => {
        let newOracle;
        beforeEach(async function() {
            LOInstance = await LockchainOracle.new(_initialRate, {
                from: _oracle
            });
            newOracle = await LockchainOracle.new(_initialRate, {
                from: _newOracle
            });
            LEInstance = await LOCExchange.new(LOInstance.address, {
                from: _owner
            });
        })

        it("should have set the oracle of the contract", async function() {
            await LEInstance.setOracle(newOracle.address, {
                from: _owner
            });
            const LEOracle = await LEInstance.LOCOracle.call();
            assert.strictEqual(LEOracle, newOracle.address, "The contract oracle was not set correctly");
        });

        it("should throw if non-owner tries to change", async function() {
            await expectThrow(LEInstance.setOracle(newOracle.address, {
                from: _notOwner
            }));
        });

        it("should throw if try to change the rate of paused contract", async function() {
            await LEInstance.pause({
                from: _owner
            });
            await expectThrow(LEInstance.setOracle(newOracle.address, {
                from: _owner
            }));
        });

        it("should emit event on change", async function() {
            const expectedEvent = 'LOGLOCOracleSet';
            let result = await LEInstance.setOracle(newOracle.address, {
                from: _owner
            });
            assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setOracle!");
            assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
        });
    });

    describe("getting the exchange rate", () => {
        beforeEach(async function() {
            LOInstance = await LockchainOracle.new(_initialRate, {
                from: _oracle
            });
            LEInstance = await LOCExchange.new(LOInstance.address, {
                from: _owner
            });
        })

        it("should have the same value in oracle and exchange", async function() {
            const exRate = await LEInstance.weiToLocWei.call();
            const rate = await LOInstance.rate.call();
            assert(exRate.eq(_initialRate), "The initial rate was not set correctly in the exchange");
            assert(exRate.eq(rate), "The initial rate was not set correctly in the oracle");
        });

        it("should throw if try to get the rate of paused contract", async function() {
            await LEInstance.pause({
                from: _owner
            });
            await expectThrow(LEInstance.weiToLocWei.call());
        });
    })


});