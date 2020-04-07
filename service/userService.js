var dao = require('../dao')
var createToken = require('../middleware/createToken')
var HealthDataList = require('../models/HealthDataList')

var BigNumber = require("bignumber.js")
var dateUtil = require('../utils/dateUtil')

var obj = {
  _code: '',
  _msg: '',
  _data: {}
}

// 用户登录
function login(req, callback){
  if(req.body && req.body.account && req.body.password){
    dao.userDao.findByAccount(req.body.account, function(status, result){
      // 验证登录
      if(1 === status && result[0] && result[0].password === req.body.password){
        obj._code = '200'
        obj._msg = '登录成功'
        obj._data = {}
        obj._data.token = createToken({id: result[0].id, type: 'user'})
        delete result[0].privateKey
        delete result[0].contractAddr
        obj._data.userInfo = result[0]
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '登录失败'
        obj._data = {}
        callback(obj)
      }
    })
  } else {
    obj._code = '201'
    obj._msg = '登录失败'
    obj._data = {}
    callback(obj)
  }
}

// 用户注册
function register(req, callback){
  if(req.body && req.body.account && req.body.password){
    // 判定账户是否已存在
    dao.userDao.findByAccount(req.body.account, function(status, result){

      if(1 === status && !result[0]){
        console.log("zh---")
        // 生成私钥、地址、初始化智能合约
        dao.ethDao.createAccout(function(status, result){
          console.log("准备以太坊信息")
          console.log(result)
          if(1 == status){
            req.body.privateKey = result.privateKey
            req.body.ethAddress = result.ethAddress
            req.body.contractAddr = result.contractAddr
            req.body.nickname = ''
            req.body.sex = ''
            req.body.birth = ''
            dao.userDao.insert(req.body, function(status){
              if(1 === status){
                obj._code = '200'
                obj._msg = '注册成功'
                obj._data = {}
                callback(obj)
              } else {
                obj._code = '201'
                obj._msg = '注册失败1'
                obj._data = {}
                callback(obj)
              }
            })
          } else {
            obj._code = '201'
            obj._msg = '注册失败2'
            obj._data = {}
            callback(obj)
          }
        })
      } else {
        obj._code = '201'
        obj._msg = '注册失败3'
        obj._data = {}
        callback(obj)
      }
    })
  } else {
    obj._code = '201'
    obj._msg = '注册失败4'
    obj._data = {}
    callback(obj)
  }
}

// 获取用户信息
function getUserInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, result){
      if(1 === status && result[0]){
        obj._code = '200'
        obj._msg = '查询成功'
        delete result[0].privateKey
        delete result[0].contractAddr
        obj._data = result[0]
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '查询失败'
        obj._data = {}
        callback(obj)
      }
    })
  } else {
    obj._code = '201'
    obj._msg = '查询失败'
    obj._data = {}
    callback(obj)
  }
}

// 更新用户信息
function updateUserInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.verify.id
    delete req.body.token
    delete req.body.verify
    dao.userDao.findByPrimaryKey(id, function(status, result){
      if(1 === status && result[0]){
        dao.userDao.updateByPrimaryKey([req.body, id], function(status){
          obj._code = '200'
          obj._msg = '更新成功'
          obj._data = {}
          callback(obj)
        })
      } else {
        obj._code = '201'
        obj._msg = '更新失败'
        obj._data = {}
        callback(obj)
      }
    })
  } else {
    obj._code = '201'
    obj._msg = '更新失败'
    obj._data = {}
    callback(obj)
  }
}

// 获取医疗服务列表
function getMedicalServiceList(req, callback){
  dao.medicalServiceDao.findAllAudited(function(status, result){
    if(1 === status){
      obj._code = '200'
      obj._msg = '查询成功'
      obj._data = {
        medicalServiceList: {
          data: result
        }
      }
      console.log("获取医疗服务列表")
      console.log(result)
      callback(obj)
    }
    else {
      obj._code = '201'
      obj._msg = '查询失败'
      obj._data = {}
      callback(obj)
    }
  })
}

// 获取用户自己的某一条健康数据
function getHealthData(req, callback){
  if(req.body && req.body.verify){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, user){
      // 显示最近一条数据
      if(1 === status && -1 === parseInt(req.body.index) && user[0]){
        dao.ethDao.getHealthCount(user[0].contractAddr, function(status, count){
          if(1 === status && count !== 0){
            dao.ethDao.getHDataByIndex(count - 1, user[0].ethAddress, user[0].contractAddr, function(status, result){
              if(1 === status){
                obj._code = '200'
                obj._msg = '查询成功'
                delete result[0]
                delete result[1]
                delete result[2]
                delete result[3]
                delete result[4]
                delete result[5]
                delete result[6]
                obj._data = result
                callback(obj)
              } else {
                obj._code = '201'
                obj._msg = '查询失败'
                obj._data = {}
                callback(obj)
              }
            })
          } else if(1 === status && 0 === count){
            obj._code = '202'
            obj._msg = '无数据'
            obj._data = {}
            callback(obj)
          } else {
            obj._code = '201'
            obj._msg = '查询失败'
            delete result[0]
            delete result[1]
            delete result[2]
            delete result[3]
            delete result[4]
            delete result[5]
            delete result[6]
            obj._data = {}
            callback(obj)
          }
        })
      } else if(1 === status && req.body.index && user[0]) {  // 显示某一条数据
        dao.ethDao.getHDataByIndex(req.body.index, user[0].ethAddress, user[0].contractAddr, function(status, result){
          if(1 === status){
            obj._code = '200'
            obj._msg = '查询成功'
            obj._data = result
            callback(obj)
          } else {
            obj._code = '201'
            obj._msg = '查询失败'
            obj._data = {}
            callback(obj)
          }
        })
      } else {
        obj._code = '201'
        obj._msg = '查询失败'
        obj._data = {}
        callback(obj)
      }
    })
  } else {
    obj._code = '201'
    obj._msg = '查询失败'
    obj._data = {}
    callback(obj)
  }
}

// 获取用户自己的全部健康数据
function getHealthDataList(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, user){
      if(1 === status && user[0]){
        dao.ethDao.getHealthCount(user[0].contractAddr, function(status, count){
          if(1 === status && 0 !== count){
            var healthDataList = new HealthDataList(count)
            healthDataList.on('dataAccepted', function(list){   // 当监听接收的数据量达到count时(或者超时)触发此事件
              obj._code = '200'
              obj._msg = '查询成功'
              obj._data = list
              callback(obj)
            })
            for(var i = 0; i < count; i ++){
              (function(i){                   // 闭包
                dao.ethDao.getHDataByIndex(i, user[0].ethAddress, user[0].contractAddr, function(status, result){
                  if(1 === status){
                    // 去掉冗余的字段
                    delete result[0]
                    delete result[1]
                    delete result[2]
                    delete result[3]
                    delete result[4]
                    delete result[5]
                    delete result[6]
                    result['index'] = i
                    healthDataList.addHealthData(result)
                  } else {
                    healthDataList.addHealthData({
                      "heartRate": "",
                      "heat": "",
                      "sleepQuality": "",
                      "distance": "",
                      "evaluation": "",
                      "uploadTime": "",
                      "permitVisit": 0,
                      "index": -1
                    })
                  }
                })
              })(i)
            }
          } else if(1 === status && 0 === count){
            obj._code = '202'
            obj._msg = '无数据'
            obj._data = {}
            callback(obj)
          } else {
            obj._code = '201'
            obj._msg = '查询失败..'
            obj._data = {}
            callback(obj)
          }
        })
      } else {
        obj._code = '201'
        obj._msg = '查询失败....'
        obj._data = {}
        callback(obj)
      }
    })
  } else {
    obj._code = '201'
    obj._msg = '查询失败'
    obj._data = {}
    callback(obj)
  }
}

// 获取用户自己的健康数据条数
function getHealthCount(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, user){
      if(1 === status && user[0]){
        dao.ethDao.getHealthCount(user[0].contractAddr, function(status, result){
          if(1 === status){
            obj._code = '200'
            obj._msg = '查询成功'
            obj._data = {
              count: result
            }
            callback(obj)
          } else {
            obj._code = '201'
            obj._msg = '查询失败'
            obj._data = {}
            callback(obj)
          }
        })
      }
    })
  } else{
    obj._code = '201'
    obj._msg = '查询失败'
    obj._data = {}
    callback(obj)
  }
}

// 用户转账
function transfer(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.verify.id

    dao.userDao.findByPrimaryKey(id, function(status, result){

      if( 1 === status && result[0]){
        var senderPrivateKey = result[0].privateKey;
        var receiverEthAddr = req.body.receiverEthAddr;
        var value = new BigNumber(req.body.value);

        dao.ethDao.transfer(senderPrivateKey, receiverEthAddr, value, function(sta){
          console.log("进入到转账函数.." + sta)
          if( 1 === sta){
            var record = {
              sendAddress: result[0].ethAddress,  // 发送方地址
              recieveAddress: receiverEthAddr,  // 接收方地址
              transactEth: value,     // 交易金额
              transactTime: dateUtil.format(new Date(), '-'),   // 交易时间
              transactAddr: '',       // 交易地址
              transactRemarks: req.body.transactRemarks  // 备注
            }

            dao.transactionrecordDao.insert(record, function(s, r){
              if( 1 === s){
                obj._code = "200";
                obj._msg = "转账成功..记录插入成功..";
                obj._data = {};
                callback(obj);
              }
              else{
                obj._code = "201";
                obj._msg = "交易记录插入失败";
                obj._data = {};
                callback(obj);
              }
            })

          }
          else{
            obj._code = "201";
            obj._msg = "转账失败..";
            obj._data = {};
            callback(obj);
          }
        })
      }
      else{
        obj._code = "201";
        obj._msg = "转账用户不存在..";
        obj._data = {};
        callback(obj);
      }
    })
  }
}

function getBalance(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, user){
      if(1 === status && user[0]){
        dao.ethDao.getBalance(user[0].ethAddress, function(status, result){
          if(1 === status){
            obj._code = '200'
            obj._msg = '查询成功'
            obj._data = {
              balance: result
            }
            callback(obj)
          } else {
            obj._code = '201'
            obj._msg = '查询失败'
            obj._data = {}
            callback(obj)
          }
        })
      }
    })
  } else{
    obj._code = '201'
    obj._msg = '查询失败'
    obj._data = {}
    callback(obj)
  }
}

function transferUserToUser(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.verify.id
    dao.userDao.findByPrimaryKey(id, function(status, result){
      if( 1 === status && result[0]){
        console.log(result[0])
        dao.userDao.findByAccount(req.body.account, function(status1, result1){
          if(1 === status1 && result1[0]){
            var senderPrivateKey = result[0].privateKey;
            var receiverEthAddr = result1[0].ethAddress;
            var value = new BigNumber(req.body.value);
            dao.ethDao.transfer(senderPrivateKey, receiverEthAddr, value, function(sta){
              if( 1 === sta){
                var record = {
                  sendAddress: result[0].ethAddress,  // 发送方地址
                  recieveAddress: receiverEthAddr,  // 接收方地址
                  transactEth: value,     // 交易金额
                  transactTime: dateUtil.format(new Date(), '-'),   // 交易时间
                  transactRemarks: req.body.transactRemarks  // 备注

                }
                dao.transactionrecordDao.insert(record, function(s, r){
                  if( 1 === s){
                    obj._code = "200";
                    obj._msg = "转账成功..记录插入成功..";
                    obj._data = {};
                    callback(obj);
                  }
                  else{
                    obj._code = "201";
                    obj._msg = "交易记录插入失败";
                    obj._data = {};
                    callback(obj);
                  }
                })

              }
              else{
                obj._code = "201";
                obj._msg = "转账失败..";
                obj._data = {};
                callback(obj);
              }
            })
          }else{
            obj._code = "201";
            obj._msg = "转账失败..";
            obj._data = {};
            callback(obj);
          }
        })
      }
      else{
        obj._code = "201";
        obj._msg = "转账用户不存在..";
        obj._data = {};
        callback(obj);
      }
    })
  }
}

// 查询机构访问的时间和机构名称
function findRecordAndOrnInfoByUserId(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.verify.id;
    dao.visitorrecordDao.findRecordAndOrnInfoByUserId(id, function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "访客记录查询成功..";
        obj._data = result;
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "访客记录查询失败..";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "访客记录查询失败......";
    obj._data = {};
    callback(obj);
  }
}

// 查询购买服务的交易记录
function findBytransactRemarks(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var sendAddress = req.body.ethAddress;
    dao.transactionrecordDao.findBytransactRemarks(sendAddress, function(status, result){
      if( 1 === status && result[0]){
        obj._code = "200";
        obj._msg = "购买服务记录查询成功..";
        obj._data = result;
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "购买服务记录查询失败..";
        obj._data = result;
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "购买服务记录查询失败....";
    obj._data = result;
    callback(obj);
  }
}


// 查询交易记录
function findRecordByEthAddress(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var ethAddress = req.body.ethAddress;
    dao.transactionrecordDao.findByEthAddress(ethAddress, function(status, result){
      if( 1 === status ){
        obj._code = "200";
        obj._msg = "购买服务记录查询成功..";
        obj._data = result;
        console.log(result[0])
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "购买服务记录查询失败！！";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "购买服务记录查询失败....";
    obj._data = {};
    callback(obj);
  }
}

function UserTransactionRecordDetail(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.id;
    dao.transactionrecordDao.findByPrimaryKey(id, function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "交易记录详情查询成功..";
        obj._data = result;
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "交易记录详情查询失败..";
        obj._data = result;
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "交易记录详情查询失败..";
    obj._data = result;
    callback(obj);
  }
}

module.exports = {
  login,
  register,
  getUserInfo,
  updateUserInfo,
  getMedicalServiceList,
  getHealthData,
  getHealthDataList,
  getHealthCount,
  transfer,
  getBalance,
  transferUserToUser,
  findRecordAndOrnInfoByUserId,
  findBytransactRemarks,
  findRecordByEthAddress,
  UserTransactionRecordDetail
}
