var LockchainAlpha = artifacts.require("./LockchainAlpha.sol");
var LockchainOracle = artifacts.require("./LockchainOracle.sol");
var LOCExchange = artifacts.require("./LOCExchange.sol");

module.exports = async function(deployer) {
    deployer.deploy(LockchainAlpha, "0x0");
    deployer.deploy(LockchainOracle, 10000);
    let oracle = await LockchainOracle.deployed();
    deployer.deploy(LOCExchange, oracle.address);
};