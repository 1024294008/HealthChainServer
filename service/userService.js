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
    // 生成私钥和地址
    req.body.privateKey = '0xa82f32bfa82f32bfa82f32bfa82f32bfa82f32b1'
    req.body.ethAddress = '0xfa82f3fa82f3fa82f3fa82f3fa82f3fa82f3fa8f'
    req.body.balance = 0

    // 判定账户是否已存在
    dao.userDao.findByAccount(req.body.account, function(status, result){
      if(1 === status && !result[0]){
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
}

// 获取用户信息
function getUserInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.userDao.findByPrimaryKey(req.body.verify.id, function(status, result){
      if(1 === status && result[0]){
        obj._code = '200'
        obj._msg = '查询成功'
        delete result[0].privateKey
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

// 获取健康数据
function getHealthData(req, callback){
  if(req.body && req.body.verify){
    dao.user_healthdataDao.findAllDataById(req.body.verify.id, function(status, result){
      if(1 === status){
        obj._code = '200'
        obj._msg = '查询成功'
        obj._data = {
          healthMetaDataList: result
        }
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '查询失败'
        obj._data = {}
      }
    })
  } else {
    obj._code = '200'
    obj._msg = '查询失败'
    obj._data = {}
  }
}

module.exports = {
  login,
  register,
  getUserInfo,
  updateUserInfo,
  getMedicalServiceList,
  getHealthData
}
