const Auth = artifacts.require("./Auth.sol");
const Identity = artifacts.require("./Identity.sol");

module.exports = function(deployer) {
  deployer.deploy(Auth, Identity.address); // Pass Identity contract address
};