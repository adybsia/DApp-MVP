var LockchainMVP = artifacts.require("./LockchainMVP.sol");

module.exports = function(deployer) {
  deployer.deploy(LockchainMVP);
};
