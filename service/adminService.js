var dao = require('../dao')
var createToken = require('../middleware/createToken')

var obj = {
  _code: '',
  _msg: '',
  _data: {}
}

// 管理员登录
function login(req, callback){
  if(req.body && req.body.account && req.body.password){
    dao.adminDao.findByAccount(req.body.account, function(status, result){

      if(1 === status && result[0].password === req.body.account){
        obj._code = "200";
        obj._msg = "登录成功~";
        obj._data = result[0];
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "登录失败~";
        obj._data = {};
        callback(obj);
      }

    })
  }
}

// 管理员注册
function regist(req, callback){
  if(req.body){

    var ethaddr = "0xxxxxx" // 调用web3产生的账户
    var key = "0xxxxxxx"  // 调用web3产生的
    var bal = 0.000

    var admin = {
      account: req.body.account,
      password: req.body.password,
      ethAddress: ethaddr,
      privateKey: key,
      authority: req.body.authority,
      balance: bal
    }

    dao.adminDao.insert(admin, function(status, result){
      if(1 === status){
        obj._code = "200";
        obj._msg = "注册成功";
        obj._data = {};
        callback(obj)
      }
      else{
        obj._code = "201";
        obj._msg = "注册失败";
        obj._data = {};
        callback(obj)
      }
    })
  }
}

// 根据id删除
function deleteAdmin(req, callback){
  if(req.body){
    var params = {id: req.body.id}
    dao.adminDao.deleteByPrimaryKey(params, function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "删除成功";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "删除失败";
        obj._data = {};
        callback(obj);
      }
    })
  }
}


// 修改管理员信息
function updateAdmin(req, callback){
  if(req.body){
    var admin = {
      account: req.body.account,
      password: req.body.password,
      ethAddress: ethaddr,
      privateKey: key,
      authority: req.body.authority
    }
    dao.adminDao.updateByPrimaryKey(admin, function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "修改成功"
      }
      else {

      }
    })
  }
}


module.exports = {

}
