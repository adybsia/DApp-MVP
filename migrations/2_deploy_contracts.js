var LockchainAlpha = artifacts.require("./LockchainAlpha.sol");
var LockchainOracle = artifacts.require("./LockchainOracle.sol");
var LOCExchange = artifacts.require("./LOCExchange.sol");
var MintableToken = artifacts.require("./tokens/MintableToken.sol");

module.exports = async function(deployer) {
    // Change accounts on deploy
    let account1 = '0x6039F021F638A74fBBefdE70D4Ac319665c694bD';
    let account2 = '0x9bF528C355c83cC5a7153bCFE6cdCD8E321072FD';
    let LAInstance;
    let ERC20Instance;
    let LOInstance;

    await deployer.deploy(MintableToken);    // ropsten - 0x13eaf683916c66b232ff5b823d65ffb54512ae7a

    ERC20Instance = await MintableToken.deployed();
    await deployer.deploy(LockchainAlpha, ERC20Instance.address);    // ropsten - 0xaef24dbcafefbe6142ef7b6e7d55785894c2ea98
    LAInstance = await LockchainAlpha.deployed();
    await deployer.deploy(LockchainOracle, 5000);    // ropsten - 0x5c02c5f921307d9151052e48e9f20aada2422edd
    LOInstance = await LockchainOracle.deployed();
    
    await deployer.deploy(LOCExchange, LOInstance.address, ERC20Instance.address);    // ropsten - 0x13615ed1479b61751ce56189839f3a126e3847a9

    await ERC20Instance.mint(account1, 200000000000000000000000);
    await ERC20Instance.mint(account2, 200000000000000000000000);
};