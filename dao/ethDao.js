var Web3 = require('web3')
var contractTool = require('../config/contractTool')

var web3 = new Web3(new Web3.providers.HttpProvider(contractTool.gethUrl))

// 生成私钥、地址，部署并初始化一个新的合约，指定拥有者为此地址
function createAccout(callback){
    // 生成私钥和地址
    var account = web3.eth.accounts.create()

    // 部署合约
    var userContract = new web3.eth.Contract(contractTool.userContractAbi)
    userContract.deploy({
        data: contractTool.userByteCode,
        arguments: [account.address, contractTool.adminContractAddress]     // 指定合约所属地址
    }).send({
        from: contractTool.adminAddress,
        gas: 3000000
    }).then(function(newContractInstance){
        // 初始化此合约一定的以太币
        web3.eth.sendTransaction({
            from: contractTool.adminAddress,
            to: newContractInstance.options.address,
            value: 20000000000000000000                 // 20ETH
        }).then(function(){
            // 初始化用户一定的以太币
            web3.eth.sendTransaction({
                from: contractTool.adminAddress,
                to: account.address,
                value: 1000000000000000000             // 1ETH
            }).then(function(){
                result = {                             // 成功部署和初始化
                    privateKey: account.privateKey,
                    ethAddress: account.address,
                    contractAddr: newContractInstance.options.address
                }
                callback(1, result)
            }, function(){callback(0)})
        }, function(){callback(0)})
    }, function(){callback(0)})
}



// 由用户调用，获取用户链上基本信息，包括合约所属地址、总访客数和最近一次上传时间
// ethAddress: 用户以太坊地址，contractAddr：用户的合约地址
function getUserInfo(ethAddress, contractAddr, callback){
    var healthContract = new web3.eth.Contract(contractTool.userContractAbi, contractAddr)

    healthContract.methods.getUserInfo(ethAddress).call().then(function(result){callback(1, result)}, function(){callback(0)});
}


// 由用户调用，上传数据(合约自动执行上传时间间隔限制，奖励机制：公开数据双倍奖励)
function addData(healthData, privateKey, contractAddr, callback){
    var healthContract = new web3.eth.Contract(contractTool.userContractAbi, contractAddr)

    // 通过私钥获得账户
    var account = web3.eth.accounts.privateKeyToAccount(privateKey)
    // 构造一个原生交易
    var tx = {
        to: contractAddr,
        gasLimit: 546157,
        value: 0,
        data: healthContract.methods.addData(healthData.heartRate, healthData.heat, healthData.sleepQuality,
            healthData.distance, healthData.evaluation, healthData.uploadTime, healthData.permitVisit).encodeABI()  // 为指定的合约方法进行ABI编码
    }
    // 对原生交易进行签名并发送
    account.signTransaction(tx).then(function(result){
        web3.eth.sendSignedTransaction(result.rawTransaction.toString('hex'), function(err){err?callback(0):callback(1)})
    }, function(){callback(0)})

}


// 所有人都可调用，获取某个用户全部健康数据条数(公开数据+隐私数据)
// contractAddr：要查看条数的智能合约地址
function getHealthCount(contractAddr, callback){
    var healthContract = new web3.eth.Contract(contractTool.userContractAbi, contractAddr)

    healthContract.methods.getHealthCount().call().then(function(result){callback(1, result)}, function(){callback(0)});
}


// 所有人都可调用，获取公开的健康数据条数
// contractAddr：要查看条数的智能合约地址
function getPublicHealthCount(contractAddr, callback){
    var healthContract = new web3.eth.Contract(contractTool.userContractAbi, contractAddr)

    healthContract.methods.getPublicHealthCount().call().then(function(result){callback(1, result)}, function(){callback(0)});
}


// 机构调用，授权给机构(机构通过支付以太币来获取对数据访问的有效时间)，ethAddress为机构以太坊地址
// organizationName：机构名，privateKey：机构私钥，contractAddr：机构需要查看的智能合约地址，value：机构为授权愿意支付的费用（多出的费用自动退回）
function authToOrg(organizationName, privateKey, contractAddr, value, callback){
    var healthContract = new web3.eth.Contract(contractTool.userContractAbi, contractAddr)

    // 通过私钥获得账户
    var account = web3.eth.accounts.privateKeyToAccount(privateKey)
    // 构造一个原生交易
    var tx = {
        to: contractAddr,
        gasLimit: 546157,
        value: value,
        data: healthContract.methods.authToOrg(organizationName).encodeABI()  // 为指定的合约方法进行ABI编码
    }
    // 对原生交易进行签名并发送
    account.signTransaction(tx).then(function(result){
        web3.eth.sendSignedTransaction(result.rawTransaction.toString('hex'), function(err){err?callback(0):callback(1)})
    }, function(){callback(0)})
}


// 所有人都可调用，获取某个机构在某个用户智能合约地址上的授权信息(剩余的时间)
// ethAddress：要查看剩余时间的机构以太坊地址，contractAddr：目标用户智能合约地址
function getAuthInfo(ethAddress, contractAddr, callback){
    var healthContract = new web3.eth.Contract(contractTool.userContractAbi, contractAddr)

    healthContract.methods.getAuthInfo(ethAddress).call().then(function(result){callback(1, result)}, function(){callback(0)});
}


// 访问指定一条健康数据,用户可以访问自己的全部数据，机构只能在有权限的情况下访问用户的公开数据(不能访问隐私数据)
// index：健康数据序号，ethAddress：查看方以太坊地址，contractAddr：被查看方智能合约地址
function getHDataByIndex(index, ethAddress, contractAddr, callback){
    var healthContract = new web3.eth.Contract(contractTool.userContractAbi, contractAddr)

    healthContract.methods.getHDataByIndex(ethAddress, index).call().then(function(result){callback(1, result)}, function(){callback(0)});
}


// 管理员调用，管理员给某一账户转一定的以太币
// receiverEthAddr：接收方以太坊地址
function transferToUser(receiverEthAddr, value, callback){
    web3.eth.sendTransaction({
        from: contractTool.adminAddress,
        to: receiverEthAddr,
        value: value
    }).then(function(){callback(1)}, function(){callback(0)})
}


// 所有人调用（除管理员），由一个账户向另一个账户转一定的以太币
// senderPrivateKey：发送方私钥，receiverEthAddr：接收方以太坊地址，value：转账金额
function transfer(senderPrivateKey, receiverEthAddr, value, callback){
    // 通过私钥获得账户
    var account = web3.eth.accounts.privateKeyToAccount(senderPrivateKey)
    // 构造一个原生交易
    var tx = {
        to: receiverEthAddr,
        gasLimit: 546157,
        value: value,
        data: ''
    }
    // 对原生交易进行签名并发送
    account.signTransaction(tx).then(function(result){
        web3.eth.sendSignedTransaction(result.rawTransaction.toString('hex')).then(function(){callback(1)}, function(){callback(0)})
    })
}

// 所有人调用，获取账户余额
// ethAddress：要查看余额的以太坊地址
function getBalance(ethAddress, callback){
    web3.eth.getBalance(ethAddress).then(function(result){callback(1, result)}, function(){callback(0)})
}

module.exports = {
    createAccout,
    getUserInfo,
    addData,
    getHealthCount,
    getPublicHealthCount,
    authToOrg,
    getAuthInfo,
    getHDataByIndex,
    transferToUser,
    transfer,
    getBalance
}


