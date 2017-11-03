var LockchainAlpha = artifacts.require("./LockchainAlpha.sol");
var LockchainOracle = artifacts.require("./LockchainOracle.sol");
var LOCExchange = artifacts.require("./LOCExchange.sol");
var MintableToken = artifacts.require("./tokens/MintableToken.sol");

module.exports = async function(deployer) {
    // Change accounts on deploy
    let account1 = '';
    let account2 = '';

    await deployer.deploy(MintableToken, {
        from: account1
    });
    await deployer.deploy(LockchainAlpha, MintableToken.address, {
        from: account1
    });
    await deployer.deploy(LockchainOracle, 5000, {
        from: account1
    });
    await deployer.deploy(LOCExchange, LockchainOracle.address, MintableToken.address, {
        from: account1
    });

    let LAInstance;
    let ERC20Instance;

    ERC20Instance = await MintableToken.deployed();
    LAInstance = await LockchainAlpha.deployed();
    await ERC20Instance.mint(account1, 1000000, {
        from: account1
    });
    await ERC20Instance.mint(account2, 1000000, {
        from: account1
    });
};