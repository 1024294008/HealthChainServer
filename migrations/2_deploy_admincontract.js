var AdminContract = artifacts.require("AdminContract");

module.exports = function(deployer) {
  deployer.deploy(AdminContract);
};
