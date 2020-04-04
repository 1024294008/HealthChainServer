var AdminContract = artifacts.require("AdminContract");
// var HealthContract = artifacts.require("HealthContract");

module.exports = function(deployer) {
  deployer.deploy(AdminContract);
};
