var LockchainAlpha = artifacts.require("./LockchainAlpha.sol");
var LockchainOracle = artifacts.require("./LockchainOracle.sol");
var LOCExchange = artifacts.require("./LOCExchange.sol");
var MintableToken = artifacts.require("./tokens/MintableToken.sol");

var environment = 'testrpc';

module.exports = async function(deployer) {
    // Change accounts on deploy
    let account1 = '0xd3521c853058981a15b04534a1cb0d0b9b23e085';
    let account2 = '0x602ae3c5341d0285a3073ecd78d9be2f67d7556c';

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