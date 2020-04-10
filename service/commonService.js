var dao = require('../dao')
var BigNumber = require("bignumber.js")
var dateUtil = require('../utils/dateUtil')
var obj = {
  _code: "",
  _msg: "",
  _data: {}
}

// 获取机构信息  其他机构或用户获取某机构除密码以外的公共信息
function getOrgInfo(req, callback){
  if(req.query && req.query.id){
    dao.orgDao.findByPrimaryKey(req.query.id,function(status, result){
      if(1 === status  && result[0]){
        obj._code = '200'
        obj._msg = '查找成功'
        delete result[0].password
        delete result[0].privateKey
        obj._data.orgInfo = result[0]
        callback(obj)
      }else{
        obj._code = '201'
        obj._msg = '查找失败'
        obj._data = {}
        callback(obj)
      }
    })
  }else{
    obj._code = '201'
    obj._msg = '查找失败'
    obj._data = {}
    callback(obj)
  }
}

// 获取服务信息
function getMedicalServiceInfo(req, callback){
  if(req.query && req.query.id){
    dao.medicalServiceDao.findByPrimaryKey(req.query.id,function(status, result){
      if(1 === status && result[0]){
        obj._code = '200'
        obj._msg = '查找成功'
        obj._data.meidcalInfo = result[0]
        callback(obj)
      }else{
        obj._code = '201'
        obj._msg = '查找失败'
        obj._data = {}
        callback(obj)
      }
    })
  }else{
    obj._code = '201'
    obj._msg = '查找失败'
    obj._data = {}
    callback(obj)
  }
}

// 机构上传健康数据
function uploadOrgHealthData(req, callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.heartRate && req.body.heat && req.body.sleepQuality && req.body.distance && req.body.evaluation && req.body.permitVisit){
    // 查找机构用户的私钥和合约地址
    dao.orgDao.findByPrimaryKey(req.body.id, function(status1, result1){
      if( 1 === status1 && result1[0]){
        var healthData = {
          "heartRate": req.body.heartRate,
          "heat": req.body.heat,
          "sleepQuality": req.body.sleepQuality,
          "distance": req.body.distance,
          "evaluation": req.body.evaluation,
          "uploadTime": dateUtil.format(new Date(), '-'),
          "permitVisit": parseInt(req.body.permitVisit)
        }
        var privateKey = result1[0].privateKey
        var contractAddr = result1[0].contractAddr
        dao.ethDao.addData(healthData, privateKey, contractAddr, function(status2, result2){
          if(1 === status2){
            obj._code = '200'
            obj._msg = '上传成功'
            obj._data = {}
            callback(obj)
          }else{
            obj._code = '201'
            obj._msg = '上传失败'
            obj._data = {}
            callback(obj)
          }
        })
      }else{
        obj._code = '201'
        obj._msg = '上传失败'
        obj._data = {}
        callback(obj)
      }
    })
  }else{
    obj._code = '201'
    obj._msg = '上传失败'
    obj._data = {}
    callback(obj)
  }
}

// 用户上传健康数据
function uploadUserHealthData(req, callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.heartRate && req.body.heat && req.body.sleepQuality && req.body.distance && req.body.evaluation && req.body.permitVisit){
    // 查找用户的私钥和合约地址
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status1, result1){
      // console.log(result1[0])
      console.log(status1)
      if( 1 === status1 && result1[0]){
        var healthData = {
          "heartRate": req.body.heartRate,
          "heat": req.body.heat,
          "sleepQuality": req.body.sleepQuality,
          "distance": req.body.distance,
          "evaluation": req.body.evaluation,
          "uploadTime": dateUtil.format(new Date(), '-'),
          "permitVisit": parseInt(req.body.permitVisit)
        }
        var privateKey = result1[0].privateKey
        var contractAddr = result1[0].contractAddr
        dao.ethDao.addData(healthData, privateKey, contractAddr, function(status2, result2){
          console.log(status2)
          if(1 === status2){
            obj._code = '200'
            obj._msg = '上传成功'
            obj._data = {}
            callback(obj)
          }else{
            obj._code = '201'
            obj._msg = '上传失败'
            obj._data = {}
            callback(obj)
          }
        })
      }else{
        obj._code = '201'
        obj._msg = '上传失败'
        obj._data = {}
        callback(obj)
      }
    })
  }else{
    obj._code = '201'
    obj._msg = '上传失败'
    obj._data = {}
    callback(obj)
  }
}

// 用户向别人转账
function transferFromUser(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.verify.id
    dao.userDao.findByPrimaryKey(id, function(status, result){
      if( 1 === status && result[0]){
        console.log(result[0])
        var senderPrivateKey = result[0].privateKey;
        var receiverEthAddr = req.body.receiverEthAddr;
        var value = new BigNumber(req.body.value);

        dao.ethDao.transfer(senderPrivateKey, receiverEthAddr, value, function(sta){
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

// 机构向别人转账
function transferFromOrg(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.verify.id
    dao.orgDao.findByPrimaryKey(id, function(status, result){
      if( 1 === status && result[0]){
        var senderPrivateKey = result[0].privateKey;
        var receiverEthAddr = req.body.receiverEthAddr;
        var value = new BigNumber(req.body.value);

        dao.ethDao.transfer(senderPrivateKey, receiverEthAddr, value, function(sta){
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
// 获取服务详情和对应的机构信息
function getServiceAndOrg(req, callback){
  if(req.query && req.query.id){
    dao.orgDao.findByServiceId(req.query.id,function(status, result){
      if(1 === status && result[0]){
        obj._code = '200'
        obj._msg = '查找成功'
        obj._data.serviceAndOrgInfo = result[0]
        console.log(obj)
        callback(obj)
      }else{
        obj._code = '201'
        obj._msg = '查找失败'
        obj._data = {}
        callback(obj)
      }
    })
  }else{
    obj._code = '201'
    obj._msg = '查找失败'
    obj._data = {}
    callback(obj)
  }
}
module.exports = {
  getOrgInfo,
  getMedicalServiceInfo,
  getServiceAndOrg,
  uploadOrgHealthData,
  uploadUserHealthData,
  transferFromUser,
  transferFromOrg
}
