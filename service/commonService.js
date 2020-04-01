var dao = require('../dao')

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
  transfer
}
