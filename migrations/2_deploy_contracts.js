var LockchainAlpha = artifacts.require("./LockchainAlpha.sol");

module.exports = function (deployer) {
  deployer.deploy(LockchainAlpha, "0x0");
};
