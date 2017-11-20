var LockchainAlpha = artifacts.require("./LockchainAlpha.sol");
var LockchainOracle = artifacts.require("./LockchainOracle.sol");
var LOCExchange = artifacts.require("./LOCExchange.sol");
var MintableToken = artifacts.require("./tokens/MintableToken.sol");

module.exports = async function(deployer) {
    // Change accounts on deploy
    let account1 = '0xa65b890e61047a3e04dd533817817dafb3e2384b';
    let account2 = '0x0b4822b88652fd2925c499618e3bb4d1507cd784';
    let LAInstance;
    let ERC20Instance;
    let LOInstance;

    await deployer.deploy(MintableToken);    // ropsten - 0xd6e3ad737ac0c0cebbe302d20ed8c6dd00219dff

    ERC20Instance = await MintableToken.deployed();
    await deployer.deploy(LockchainAlpha, ERC20Instance.address);    // ropsten - 0xc09c3ea5967386dfec804f25b0884b6327a006a6
    LAInstance = await LockchainAlpha.deployed();
    await deployer.deploy(LockchainOracle, 5000);    // ropsten - 0xe4953584cc8f2c65866858cb61c481536fdfb189
    LOInstance = await LockchainOracle.deployed();
    
    await deployer.deploy(LOCExchange, LOInstance.address, ERC20Instance.address);    // ropsten - 0xd596aff1b6d05ed89e3362101be199ebc12b0217

    await ERC20Instance.mint(account1, 200000000000000000000000);
    await ERC20Instance.mint(account2, 200000000000000000000000);
};