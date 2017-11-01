const LockchainOracle = artifacts.require("./LockchainOracle.sol");
const LOCExchange = artifacts.require("./LOCExchange.sol");
const MintableToken = artifacts.require("./tokens/MintableToken.sol");
const util = require('./util');
const expectThrow = util.expectThrow;

contract('LOCExchange', function(accounts) {

    let LockchainOracleInstance;
    let LOCExchangeIntance;
    let ERC20Instance;
    
    const _owner = accounts[0];
    const _notOwner = accounts[1];

    const _initialRate = 2;
    const _weiAmount = 1000000000000000000;
    const _notOwnerLOCAmount = _weiAmount * _initialRate;
    const _ethForExchangeContract = 1;
    
    describe("constructor", () => {
        beforeEach(async function() {
            ERC20Instance = await MintableToken.new({
                from: _owner
            });
            LockchainOracleInstance = await LockchainOracle.new(_initialRate, {
                from: _owner
            });
            LOCExchangeIntance = await LOCExchange.new(LockchainOracleInstance.address, ERC20Instance.address, {
                from: _owner
            });

            await ERC20Instance.mint(_notOwner, _notOwnerLOCAmount, {
                from: _owner
            });
        });

        it("should have set the owner of the contract", async function() {
            const LOCExchangeOwner = await LOCExchangeIntance.owner.call();
            assert.strictEqual(LOCExchangeOwner, _owner, "The contract owner was not set correctly");
        });

        it("should have set the initial rate correctly", async function() {
            const rate = await LOCExchangeIntance.rate.call();
            assert(rate.eq(_initialRate), "The initial rate was not set correctly");
        });

        it("should have set the token contract", async function() {
            const LOCExchangeERC20Address = await LOCExchangeIntance.LOCTokenContract.call();
            assert.strictEqual(LOCExchangeERC20Address, ERC20Instance.address, "The token contract was not set correctly");
        });
    });

    describe("exchange", () => {
        beforeEach(async function() {
            ERC20Instance = await MintableToken.new({
                from: _owner
            });
            LockchainOracleInstance = await LockchainOracle.new(_initialRate, {
                from: _owner,
            });
            LOCExchangeIntance = await LOCExchange.new(LockchainOracleInstance.address, ERC20Instance.address, {
                from: _owner
            });

            web3.eth.sendTransaction({
                from: _owner, 
                to: LOCExchangeIntance.address, 
                value: web3.toWei(_ethForExchangeContract, "ether")
            });

            await ERC20Instance.mint(_notOwner, _notOwnerLOCAmount, {
                from: _owner
            });
        });

        it("should return corresponding amount in LocWei", async function() {
            const rate = await LOCExchangeIntance.rate();

            const locWeiAmount = await LOCExchangeIntance.weiToLocWei(_weiAmount, {
                from: _owner
            });

            const expectedLocAmount = _weiAmount * rate;
            assert(locWeiAmount.eq(expectedLocAmount), "The locWei amount is not correct!");
        });

        it("should transfer ETH to caller address", async function() {
            const locWeiAmount = await LOCExchangeIntance.weiToLocWei(_weiAmount, {
                from: _notOwner
            });
            await ERC20Instance.approve(LOCExchangeIntance.address, locWeiAmount, {
                from: _notOwner
            });
            
            const ethBalanceBefore = await web3.eth.getBalance(_notOwner);
            const ethSend = await LOCExchangeIntance.exchangeLocWeiToEthWei(locWeiAmount, {
                from: _notOwner
            });
            
            let ethBalanceAfter = await web3.eth.getBalance(_notOwner);
            assert(ethBalanceAfter.gt(ethBalanceBefore), "Final account balance is not more than initial!");
         });

         it("should transfer LOC", async function() {
            const locWeiAmount = await LOCExchangeIntance.weiToLocWei(_weiAmount, {
                from: _notOwner
            });
            await ERC20Instance.approve(LOCExchangeIntance.address, locWeiAmount, {
                from: _notOwner
            });
            
            const locBalanceBeforeTransaction = await ERC20Instance.balanceOf(_notOwner);

            const ethSend = await LOCExchangeIntance.exchangeLocWeiToEthWei(locWeiAmount, {
                from: _notOwner
            });

            const locBalanceAfterTransaction = await ERC20Instance.balanceOf(_notOwner);
            
            assert(locBalanceBeforeTransaction.eq(locBalanceAfterTransaction + locWeiAmount),
                "Final account balance is not correct!"
            );
         });

         it("should return Exchange contract LOC Balance ", async function() {
            // TODO
         });
    //     it("should throw if non-owner tries to change", async function() {
    //         await expectThrow(LockchainOracleInstance.setRate(_newRate, {
    //             from: _notOwner
    //         }));
    //     });

    //     it("should emit event on change", async function() {
    //         const expectedEvent = 'LogRateChanged';
    //         let result = await LockchainOracleInstance.setRate(_newRate, {
    //             from: _owner
    //         });
    //         assert.lengthOf(result.logs, 1, "There should be 1 event emitted from setRate!");
    //         assert.strictEqual(result.logs[0].event, expectedEvent, `The event emitted was ${result.logs[0].event} instead of ${expectedEvent}`);
    //     });
    // })

    // describe("working with paused contract", () => {
    //     beforeEach(async function() {
    //         LockchainOracleInstance = await LockchainOracle.new(_initialRate, {
    //             from: _owner
    //         });
    //     })

    //     it("should throw if try to get the rate of paused contract", async function() {
    //         await LockchainOracleInstance.pause({
    //             from: _owner
    //         });
    //         await expectThrow(LockchainOracleInstance.rate.call());
    //     });

    //     it("should throw if try to change the rate of paused contract", async function() {
    //         await LockchainOracleInstance.pause({
    //             from: _owner
    //         });
    //         await expectThrow(LockchainOracleInstance.setRate(_newRate, {
    //             from: _owner
    //         }));
    //     });
    });
});