var dao = require('../dao')
var BigNumber = require("bignumber.js")
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
      if( 1 === status && result[0]){
        var healthData = {
          "heartRate": req.body.heartRate,
          "heat": req.body.heat,
          "sleepQuality": req.body.sleepQuality,
          "distance": req.body.distance,
          "evaluation": req.body.evaluation,
          "uploadTime": "2020-4-4",
          "permitVisit": req.body.permitVisit
        }
        var privateKey = result[0].privateKey
        var contractAddr = result[0].contractAddr
        dao.ethDao.addData(healthData, privateKey, contractAddr, function(status2, result2){
          if(1 === status){
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
  console.log(req.body)
  if(req.body && req.body.verify && req.body.verify.id && req.body.heartRate && req.body.heat && req.body.sleepQuality && req.body.distance && req.body.evaluation && req.body.permitVisit){
    // 查找用户的私钥和合约地址
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status1, result1){
      // console.log(result1[0])
      if( 1 === status1 && result1[0]){
        var healthData = {
          "heartRate": req.body.heartRate,
          "heat": req.body.heat,
          "sleepQuality": req.body.sleepQuality,
          "distance": req.body.distance,
          "evaluation": req.body.evaluation,
          "uploadTime": "2020-4-4",
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
// // 转账
// function transfer(req, callback){
//   console.log(req.body.verify)
//   if(req.body.verify && req.body.verify.id){
//     // 获取发送方私钥
//     dao.userDao.findByPrimaryKey(req.body.verify.id,function(status1, result1){
//       if( 1 === status1 && result1[0]){
//         //获取接收方地址
//         dao.userDao.findByAccount(req.body.receiveAccount, function(status2, result2){
//           if(1 === status2 && result2[0]){
//             // 发送方私钥， 接收方以太坊地址, 转账金额
//             dao.ethDao.transfer(result1[0].privateKey, result2[0].ethAddress, new BigNumber(req.body.value), function(status3, result3){
//               if(1 === status3){
//                 obj._code = '200'
//                 obj._msg = '转账成功'
//                 obj._data = {}
//                 callback(obj)
//                 // 将交易记录存到数据库
//                 var record = {
//                   "sendAddress": result1[0].ethAddress,
//                   "receiveAddress": result2[0].ethAddress,
//                   "transactEth": req.body.value,
//                   "transactTime": "2020-4-4",


//                 }
//               }else{
//                 obj._code = '201'
//                 obj._msg = '转账失败'
//                 obj._data = {}
//                 callback(obj)
//               }
//             })
//           }else{
//             obj._code = '201'
//             obj._msg = '转账失败'
//             obj._data = {}
//             callback(obj)
//           }
//         })
//       }else{
//         obj._code = '201'
//         obj._msg = '转账失败'
//         obj._data = {}
//         callback(obj)
//       }
//     })
//   }else{

//     obj._code = '201'
//     obj._msg = '转账失败'
//     obj._data = {}
//     callback(obj)
//   }
// }

// 获取服务详情和对应的机构信息
function getServiceAndOrg(req, callback){
  if(req.query && req.query.id){
    dao.orgDao.findByServiceId(req.query.id,function(status, result){
      if(1 === status && result[0]){
        obj._code = '200'
        obj._msg = '查找成功'
        obj._data.serviceAndOrgInfo = result[0]
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
  uploadUserHealthData
  // transfer,
}
