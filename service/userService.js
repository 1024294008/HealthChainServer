var dao = require('../dao')
var createToken = require('../middleware/createToken')

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
        // 生成私钥、地址、初始化智能合约
        dao.ethDao.createAccout(function(status, result){
          if(1 == status){
            req.body.privateKey = result.privateKey
            req.body.ethAddress = result.ethAddress
            req.body.contractAddr = result.contractAddr
            dao.userDao.insert(req.body, function(status){
              if(1 === status){
                obj._code = '200'
                obj._msg = '注册成功'
                obj._data = {}
                callback(obj)
              } else {
                obj._code = '201'
                obj._msg = '注册失败'
                obj._data = {}
                callback(obj)
              }
            })
          } else {
            obj._code = '201'
            obj._msg = '注册失败'
            obj._data = {}
            callback(obj)
          }
        })
      } else {
        obj._code = '201'
        obj._msg = '注册失败'
        obj._data = {}
        callback(obj)
      }
    })
  } else {
    obj._code = '201'
    obj._msg = '注册失败'
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
    dao.userDao.findByPrimaryKey(req.verify.id, function(status, user){
      // 显示最近一条数据
      if(1 === status && -1 === req.body.index){
        dao.ethDao.getHealthCount(user.ethAddress, function(status, count){
          if(1 === status && count !== 0){
            dao.ethDao.getHDataByIndex(count - 1, user.ethAddress, user.contractAddr, function(status, result){
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
          } else if(1 === status && 0 === count){
            obj._code = '202'
            obj._msg = '无数据'
            obj._data = {}
            callback(obj)
          } else {
            obj._code = '201'
            obj._msg = '查询失败'
            obj._data = {}
            callback(obj)
          }
        })
      } else if(1 === status && req.body.index) {  // 显示某一条数据
        dao.ethDao.getHDataByIndex(req.body.index, user.ethAddress, user.contractAddr, function(status, result){
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

}

// 获取用户自己的健康数据条数
function getHealthCount(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, user){
      if(1 === status){
        dao.ethDao.getHealthCount(user.ethAddress, function(status, result){
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

  }
}

function getBalance(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, user){
      if(1 === status){
        dao.ethDao.getBalance(user.ethAddress, function(status, result){
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

function getBlockInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    // dao.adminEthDao.
  } else{
    obj._code = '201'
    obj._msg = '查询失败'
    obj._data = {}
    callback(obj)
  }
}

function getMinerInfo(req, callback){

}

module.exports = {
  login,
  register,
  getUserInfo,
  updateUserInfo,
  getMedicalServiceList,
  getHealthData
}
