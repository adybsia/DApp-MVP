const LockchainAlpha = artifacts.require("./LockchainAlpha.sol");
const MintableToken = artifacts.require("./tokens/MintableToken.sol");

const expectThrow = require('util').expectThrow;

contract('LockchainAlpha', function (accounts) {

  let LAInstance;
  let ERC20Instance;

  const _owner = accounts[0];
  const _notOwner = accounts[1];
  const _reserver = accounts[2];

  const reservationCostEnough = 50;
  const reservationNotCostEnough = 50;
  const standardLOCAmount = 100;

  describe("constructor", () => {
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

});
