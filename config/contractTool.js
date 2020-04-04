var adminContractArtifacts = require('../build/contracts/AdminContract.json')
var healthContractArtifacts = require('../build/contracts/HealthContract.json')

var gethUrl = 'http://127.0.0.1:8545'

var adminAddress = '0x83743cfff53699852d92298e67571c771b806d48'
var adminContractAbi = adminContractArtifacts.abi
var adminContractAddress = adminContractArtifacts['networks']['999'].address

var userContractAbi = healthContractArtifacts.abi;
var userByteCode = healthContractArtifacts.bytecode;

module.exports = {
  gethUrl,
  adminAddress,
  adminContractAbi,
  adminContractAddress,
  userContractAbi,
  userByteCode
}
