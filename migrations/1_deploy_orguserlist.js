var Org_UserList = artifacts.require("Org_UserList");


// truffle migrate --network development --reset

module.exports = function(deployer) {
  deployer.deploy(Org_UserList, '0x9b1f7F645351AF3631a656421eD2e40f2802E6c0');
};
