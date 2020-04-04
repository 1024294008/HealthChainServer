var Web3 = require('web3')
var contractTool = require('../config/contractTool')

var web3 = new Web3(new Web3.providers.HttpProvider(contractTool.gethUrl))
// 获取管理员合约实例
var adminContract = new web3.eth.Contract(contractTool.adminContractAbi, contractTool.adminContractAddress)

// 获取智能合约的管理员地址
function getAdminAddress(callback){
    adminContract.methods.getAdminAddress().call().then(function(result){callback(1, result)}, function(){callback(0)})
}

// 设置智能合约的管理员地址(先不调用此方法)
function setAdminAddress(newAddr, callback){
    adminContract.methods.setAdminAddress(newAddr).send({
        from: contractTool.adminAddress,
        value: 0
    }).then(function(){callback(1)}, function(){callback(1)})
}

// 获取单次授权消耗的以太币
function getPayforHealthData(callback){
    adminContract.methods.getPayforHealthData().call().then(function(result){callback(1, result)}, function(){callback(0)})
}

// 设置单次授权消耗的以太币
function setPayforHealthData(newPayforHealthData, callback){
    adminContract.methods.setPayforHealthData(newPayforHealthData).send({
        from: contractTool.adminAddress,
        value: 0
    }).then(function(){callback(1)}, function(){callback(1)})
}

// 获取授权有效时间间隔
function getValidSection(callback){
    adminContract.methods.getValidSection().call().then(function(result){callback(1, result)}, function(){callback(0)})
}

// 设置授权有效时间间隔
function setValidSection(newValidSection, callback){
    adminContract.methods.setValidSection(newValidSection).send({
        from: contractTool.adminAddress,
        value: 0
    }).then(function(){callback(1)}, function(){callback(1)})
}

// 获取上传有效时间间隔
function getUploadSection(callback){
    adminContract.methods.getUploadSection().call().then(function(result){callback(1, result)}, function(){callback(0)})
}

// 设置上传有效时间间隔
function setUploadSection(newUploadSection, callback){
    adminContract.methods.setUploadSection(newUploadSection).send({
        from: contractTool.adminAddress,
        value: 0
    }).then(function(){callback(1)}, function(){callback(1)})
}

// 获取用户上传可获得的奖励
function getAward(callback){
    adminContract.methods.getAward().call().then(function(result){callback(1, result)}, function(){callback(0)})
}

// 设置用户上传可获得的奖励
function setAward(newAward, callback){
    adminContract.methods.setAward(newAward).send({
        from: contractTool.adminAddress,
        value: 0
    }).then(function(){callback(1)}, function(){callback(1)})
}

// 获取管理员挖矿信息（矿工地址，矿工余额，当前区块高度，汽油费）
function getMinerInfo(callback){
    web3.eth.getBalance(contractTool.adminAddress).then(function(balance){
        web3.eth.getBlockNumber().then(function(height){
            web3.eth.getGasPrice().then(function(gasPrice){
                var result = {
                    miner: contractTool.adminAddress,
                    balance: balance,
                    blockNumber: height,
                    gasPrice: gasPrice
                }
                callback(1, result)
            }, function(){callback(0)})
        }, function(){callback(0)})
    }, function(){callback(0)})
}

// 获取当前区块高度
function getBlockHeight(callback){
    web3.eth.getBlockNumber().then(function(result){callback(1, result)}, function(){callback(0)})
}

// 获取某一区块信息
function getBlockInfo(num, callback){
    web3.eth.getBlock(num).then(function(result){
        delete result.parentHash
        delete result.mixHash
        delete result.sha3Uncles
        delete result.logsBloom
        delete result.extraData
        callback(1, result)
    }, function(){callback(0)})
}

module.exports = {
    getAdminAddress,
    setAdminAddress,
    getPayforHealthData,
    setPayforHealthData,
    getValidSection,
    setValidSection,
    getUploadSection,
    setUploadSection,
    getAward,
    setAward,
    getMinerInfo,
    getBlockHeight,
    getBlockInfo
}
