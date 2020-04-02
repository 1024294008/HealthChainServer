var dao = require('../dao')

var obj = {
  _code: "",
  _msg: "",
  _data: {}
}

var obj_service_org ={
  _code:"",
  _msg:"",
  _data:{
    serviceInfo:{
      "id": "",
      "serviceName": "",
      "serviceDetails": "",
      "cost": ""
    },
    orgInfo:{
      "portrait_org": "",
      "organizationName": "",
      "introduction": "",
      "tel": ""
      }
  }
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

// 获取服务详情
function getServiceAndOrg(req, callback){
  if(req.query && req.query.id){
    dao.medicalServiceDao.findByPrimaryKey(req.query.id, function(status, result){
      if(1 === status && result[0] && result[0].oid){
        obj._code = '200'
        obj._msg = '查找成功'
        dao.orgDao.findByPrimaryKey(result[0].oid, function(stat, resu){
          if(1 === stat && resu[0]){
            obj_service_org._data.orgInfo.portrait_org = resu[0].portrait
            obj_service_org._data.orgInfo.organizationName = resu[0].organizationName
            obj_service_org._data.orgInfo.introduction = resu[0].introduction
            obj_service_org._data.orgInfo.tel = resu[0].tel
            obj_service_org._data.serviceInfo.id = result[0].id
            obj_service_org._data.serviceInfo.serviceName = result[0].serviceName
            obj_service_org._data.serviceInfo.serviceDetails = result[0].serviceDetails
            obj_service_org._data.serviceInfo.cost = result[0].cost
            callback(obj_service_org)
          }else{
            obj._code = '201'
            obj._msg = '查找失败'
            obj._data = {}
            callback(obj_service_org)
          }
        })
      }else{
        obj._code = '201'
        obj._msg = '查找失败'
        obj._data = {}
        callback(obj_service_org)
      }
    })
  }else{
    obj._code = '201'
    obj._msg = '查找失败'
    obj._data = {}
    callback(obj_service_org)
  }
}

// 上传健康数据
function uploadHealthData(req, callback){
  // 获取健康数据

  // 数据上链
}

// 转账
function transfer(req, callback){
  console.log(req.body.verify)
  if(req.body.verify && req.body.verify.id){
    // 从参数中获取发送方和接收方的以太坊地址，金额 sendAddress, recieveAddress, transactEth

    // 调用合约进行转账

    //如果不抛出异常,转账成功,同时会更新链上余额
    obj._code = '200'
    obj._msg = '转账成功'
    obj._data = {}
    callback(obj)

    //否则转账失败
    // obj._code = '201'
    // obj._msg = '转账失败'
    // obj._data = {}
    // callback(obj)
  }else{

    obj._code = '201'
    obj._msg = '转账失败'
    obj._data = {}
    callback(obj)
  }
}


module.exports = {
  getOrgInfo,
  getMedicalServiceInfo,
  uploadHealthData,
  getServiceAndOrg,
  transfer
}
