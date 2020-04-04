var dao = require('../dao')
var createToken = require('../middleware/createToken')
var BigNumber = require("bignumber.js")
var dateUtil = require('../utils/dateUtil')

var obj = {
  _code: '',
  _msg: '',
  _data: {}
}

var objList = {
  _code: '',
  _msg: '',
  _data: {
    dataList: {
      code: 0,
      msg: '',
      count: 0,
      data: []
    }
  }
}

// 管理员登录
function login(req, callback){
  if(req.body && req.body.account && req.body.password){
    dao.adminDao.findByAccount([req.body.account], function(status, result){

      if(1 === status && result[0] && result[0].password === req.body.password && result[0] !== 'disable'){
        obj._code = "200";
        obj._msg = "登录成功~";
        obj._data.token = createToken({id: result[0].id, type: 'admin'})
        delete result[0].privateKey;
        delete result[0].contractAddr;
        // obj._data.adminInfo = result[0];
        obj._data.adminInfo = JSON.stringify(result[0])
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
  else{
    obj._code = "201";
    obj._msg = "登录失败~";
    obj._data = {};
    callback(obj);
  }
}

// 判断是否是超级管理员
function isSuperAdmin(req, callback){
  if(req.body && req.body.verify){
    dao.adminDao.findByAccount(req.body.account, function(status, result){
      console.log(result)
      if( 1 === status && result[0] && result[0].authority === 'root'){
        obj._code = "200";
        obj._msg = "超级管理员";
        obj._data = {};
        callback(obj);
      }else{
        obj._code = "201";
        obj._msg = "不是超级管理员";
        obj._data = {};
        callback(obj);
      }
    })
  }else{
    obj._code = "201";
    obj._msg = "不是超级管理员";
    obj._data = {};
    callback(obj);
  }
}

// 添加管理员
function addAdminInfo(req, callback){
  if(req.body && req.body.account && req.body.password && req.body.verify && req.body.verify.id && req.body.verify.id === 1){

    var admin = {
      account: req.body.account,
      password: req.body.password,
      authority: req.body.authority,
      ethAddress: "",  // 以太坊账户
      privateKey: "",  // 私钥
      contractAddr: "" // 合约地址
    }

    // 判断账户是否存在
    dao.adminDao.findByAccount(req.body.account, function(status, result){
      if( 1 === status && result[0]){
        obj._code = "201";
        obj._msg = "注册失败..账户已经存在";
        obj._data = {};
        callback(obj);
      }
      else{

        dao.ethDao.createAccout(function(sta, res){
          if( 1 === sta){
            admin.ethAddress = res.privateKey;
            admin.privateKey = res.ethAddress;
            admin.contractAddr = res.contractAddr

            dao.adminDao.insert(admin, function(st, re){
              if(1 === st){
                obj._code = "200";
                obj._msg = "注册成功";
                obj._data = {};
                callback(obj);
              }
              else{
                obj._code = "201";
                obj._msg = "注册失败";
                obj._data = {};
                callback(obj);
              }
            })
          }
          else{
            obj._code = "201";
            obj._msg = "注册失败";
            obj._data = {};
            callback(obj);
          }
        })
      }
    })
  }
  else {
    obj._code = "201";
    obj._msg = "注册失败-有字段为空";
    obj._data = {};
    callback(obj);
  }
}

// 根据id删除
function deleteAdmin(req, callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.id && req.body.verify.id === 1){
    var params = req.body.id
    dao.adminDao.deleteByPrimaryKey(params, function(status, result){
      if( 1 === status ){
        obj._code = "200";
        obj._msg = "删除成功";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "删除失败了吗";
        obj._data = {};
        callback(obj);
      }
    })
  }
}


// 修改管理员信息
function updateAdmin(req, callback){
  if(req.body && req.body.password && req.body.verify && req.body.verify.id && req.body.id &&  req.body.verify.id === 1){
    var admin = {
      password: req.body.password,
      authority: req.body.authority,
      account:req.body.account
    }

    var id = req.body.id;

    dao.adminDao.updateByPrimaryKey([admin, id], function(status, result){
      if( 1 === status ){
        obj._code = "200";
        obj._msg = "修改成功";
        obj._data = {};
        callback(obj);
      }
      else {
        obj._code = "201";
        obj._msg = "修改失败";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "修改失败";
    obj._data = {};
    callback(obj);
  }
}

// 获取管理员列表
function getAdminList(req, callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.verify.id === 1){
    var params = {
      authority: '',
      limit: req.body.limit,
      page: req.body.page
    }
    dao.adminDao.findByConditionsCount(params, function(status, result){
      if( 1=== status && result[0]){
        // objList._code = "200";
        // objList._msg = "查找成功";
        // objList._data.dataList.count = result[0].allCount; // select count(*) as allCount .... 使用了命名allCount

        var res_json = {
          code: 0,
          msg: '',
          count: 0,
          data: []
        }

        res_json.count = result[0].allCount;

        dao.adminDao.findByConditions(params, function(st, re){
          if( 1 === st && re[0]){
            // objList._data.dataList.data = re;
            // callback(objList);
            res_json.data = re;
            dao.adminDao.closeConn();
            callback(res_json);
          }
          else {
            obj._code = "201";
            obj._msg = "查找失败..";
            obj._data = {};
            callback(obj);
          }
        });

      }
      else {
        obj._code = "201";
        obj._msg = "查找失败";
        obj._data = {};
        callback(obj);
      }
    });

  }
  else{
    obj._code = "201";
    obj._msg = "查找失败.....";
    obj._data = {};
    callback(obj);
  }
}

// 获取机构列表
function getOrgInfoList(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      certificateResult: req.body.certificateResult,
      limit: req.body.limit,
      page: req.body.page
    }
    dao.orgDao.findByConditionsCount(params, function(status, result){
      if( 1 === status && result[0]){
        // objList._code = "200";
        // objList._msg = "查找成功";
        // objList._data.dataList.count = result[0];

        var res_json = {
          code: 0,
          msg: '',
          count: 0,
          data: []
        }

        res_json.count = result[0].allCount;

        dao.orgDao.findByConditions(params, function(st, re){
          if( 1 === st && re[0]){
            // objList._data.dataList.data = re;
            // callback(objList);
            res_json.data = re;
            callback(res_json);
          }
          else{
            obj._code = "201";
            obj._msg = "查找失败！..";
            obj._data = {};
            callback(obj);
          }
        })
      }
      else{
        obj._code = "201";
        obj._msg = "查找失败....";
        obj._data = {};
        callback(obj);
      }
    })

  }
  else{
    obj._code = "201";
    obj._msg = "查找失败..";
    obj._data = {};
    callback(obj);
  }

}

// 修改机构信息(只能修改审核状态)
function updateOrgInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      certificateResult: req.body.certificateResult
    }
    var id = req.body.id;

    dao.orgDao.updateByPrimaryKey([params, id], function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "修改成功";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "修改失败..";
        obj._data = {};
        callback(obj);
      }
    })

  }
  else{
    obj._code = "201";
    obj._msg = "修改失败..";
    obj._data = {};
    callback(obj);
  }
}

// 删除机构
function delOrgInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.id;
    dao.orgDao.deleteByPrimaryKey([id], function(status, result){  // 这里的参数要给成[]
      if( 1 === status){
        obj._code = "200";
        obj._msg = "删除成功";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "删除失败..";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "删除失败..";
    obj._data = {};
    callback(obj);
  }
}

// 删除医疗服务
function deleteMedicalService(req, callback){
  console.log("删除医疗服务~~");
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.id;
    dao.medicalServiceDao.deleteByPrimaryKey(id, function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "删除成功";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "删除失败..";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "删除失败..";
    obj._data = {};
    callback(obj);
  }
}

// 条件查询医疗服务
function findMedicalServiceList(req, callback){
    if(req.body && req.body.verify && req.body.verify.id){
      var params = {
        serviceName: req.body.serviceName,
        auditResult: req.body.auditResult,
        limit: req.body.limit,
        page: req.body.page
      }

      dao.medicalServiceDao.findByConditionsCount(params, function(status, result){
        if( 1 === status && result[0]){
          // objList._code = "200";
          // objList._msg = "查找成功";
          // objList._data.dataList.count = result[0];

          var res_json = {
            code: 0,
            msg: '',
            count: 0,
            data: []
          }

          res_json.count = result[0].allCount;

          dao.medicalServiceDao.findByConditions(params, function(st, re){
            if( 1 === st && re[0]){
              res_json.data = re;
              callback(res_json);
            }
            else{
              obj._code = "201";
              obj._msg = "查找失败..";
              obj._data = {};
              callback(obj);
            }
          })
        }
        else{
          obj._code = "201";
          obj._msg = "查找失败..";
          obj._data = {};
          callback(obj);
        }
      })

    }
    else{
      obj._code = "201";
      obj._msg = "查找失败..";
      obj._data = {};
      callback(obj);
    }
}

// 修改服务信息（只能修改审核状态）
function updateMedicalServcie(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      auditResult: req.body.auditResult
    }

    var id = req.body.id;

    dao.medicalServiceDao.updateByPrimaryKey([params, id], function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "修改成功..";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "修改失败..";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "修改失败..";
    obj._data = {};
    callback(obj);
  }
}

// 获取区块信息
function getBlockInfo(req, callback){

}

// 获取日志信息
function getLogList(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    // {"operateTime": "", "operateResult": "", "limit": 1, "page": 2}
    var params = {
      operateTime: req.body.operateTime,
      operateResult: req.body.operateResult,
      limit: req.body.limit,
      page: req.body.page
    }

    dao.logDao.findByConditionsCount(params, function(status, result){
      if( 1 === status){
        // objList._code = "200";
        // objList._msg = "查找成功";
        // objList._data.dataList.count = result[0];

        var res_json = {
          code: 0,
          msg: '',
          count: 0,
          data: []
        }

        res_json.count = result[0].allCount;

        dao.logDao.findByConditions(params, function(st, re){
          if( 1 === st){
            // objList._data.dataList.data = re;
            // callback(objList);

            res_json.data = re;
            callback(res_json);

          }
          else{
            console.log(re)
            obj._code = "201";
            obj._msg = "查找失败....";
            obj._data = {};
            callback(obj);
          }
        })
      }
      else{
        obj._code = "201";
        obj._msg = "查找失败..";
        obj._data = {};
        callback(obj);
      }
    })

  }
  else{
    obj._code = "201";
    obj._msg = "查找失败..";
    obj._data = {};
    callback(obj);
  }
}

// 获取用户列表        ----       有bug     查询参数是什么？
function getUserList(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      limit: req.body.limit,
      page: req.body.page
    }
    dao.userDao.findByConditionsCount(params, function(status, result){
      if( 1=== status && result[0]){
        // objList._code = "200";
        // objList._msg = "查找成功";
        // objList._data.dataList.count = result[0];

        var res_json = {
          code: 0,
          msg: '',
          count: 0,
          data: []
        }

        res_json.count = result[0].allCount;

        dao.userDao.findByConditions(params, function(st, re){
          if( 1=== st && re[0]){
            // objList._data.dataList.data = re;
            // callback(objList);

            res_json.data = re;

            callback(res_json);
          }
          else {
            obj._code = "201";
            obj._msg = "查找失败";
            obj._data = {};
            callback(obj);
          }
        });

      }
      else {
        obj._code = "201";
        obj._msg = "查找失败";
        obj._data = {};
        callback(obj);
      }
    });

  }
  else{
    obj._code = "201";
    obj._msg = "查找失败..";
    obj._data = {};
    callback(obj);
  }
}

// 查看用户信息
function findUserInfo(req, callback){
  if( req.body && req.body.verify && req.body.verify.id){
    var id = req.body.id
    dao.userDao.findByPrimaryKey([id], function(status, result){
      if( 1 === status && result[0]){
        obj._code = "200";
        obj._msg = "查找成功";
        obj._data = result[0];
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "查找失败..";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "查找失败..";
    obj._data = {};
    callback(obj);
  }
}

// 修改用户信息
function updateUserInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      password: req.body.password
    }
    var id = req.body.id;

    console.log([params, id]);

    dao.userDao.updateByPrimaryKey([params, id], function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "修改成功";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "修改失败..";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "修改失败..";
    obj._data = {};
    callback(obj);
  }
}


// 删除用户信息
function deleteUser(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.id;
    dao.userDao.deleteByPrimaryKey([id], function(status, result){
      if( 1 === status){
        obj._code = "200";
        obj._msg = "删除成功";
        obj._data = {};
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "删除失败..";
        obj._data = {};
        callback(obj);
      }
    })
  }
  else{
    obj._code = "201";
    obj._msg = "修改失败..";
    obj._data = {};
    callback(obj);
  }
}

// 查看钱包信息
function getWalletInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var ethAddress = req.body.ethAddress;
    console.log(req.body)
    dao.ethDao.getBalance(ethAddress, function(status, result){
      if( 1 === status)
      {
        obj._code = "200";
        obj._msg = "余额获取成功";
        obj._data.getBalance = result;
        callback(obj);
      }
      else{
        obj._code = "201";
        obj._msg = "余额获取失败..";
        obj._data = {};
        callback(obj);
      }

    })
  }
  else{
    obj._code = "201";
    obj._msg = "余额获取失败..";
    obj._data = {};
    callback(obj);
  }
}

// root用户向管理员转账
function transferToUser(req, callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.verify.id === 1){
    var receiverEthAddr = req.body.receiverEthAddr;
    var value = new BigNumber(req.body.value);
    dao.ethDao.transferToUser(receiverEthAddr, value, function(status){
      if( 1 === sta){
        var record = {
          sendAddress: req.body.sendAddress,  // 发送方地址
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
}

// 管理员转账
function transfer(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.verify.id
    dao.adminDao.findByPrimaryKey(id, function(status, result){
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

// 查看交记录
function transactionRecord(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      sendAddress: req.body.sendAddress,       // 发送方是自己
      recieveAddress: req.body.sendAddress,    // 接受放也是自己
      transactTime: "",
      limit: req.body.limit,
      page: req.body.page
    }

    dao.transactionrecordDao.findByConditionsCount(params, function(status, result){
      if( 1=== status && result[0]){
        // objList._code = "200";
        // objList._msg = "查找成功";
        // objList._data.dataList.count = result[0];

        var res_json = {
          code: 0,
          msg: '',
          count: 0,
          data: []
        }

        res_json.count = result[0].allCount;

        dao.transactionrecordDao.findByConditions(params, function(st, re){
          if( 1=== st && re[0]){
            // objList._data.dataList.data = re;
            // callback(objList);

            res_json.data = re;

            callback(res_json);
          }
          else {
            obj._code = "201";
            obj._msg = "查找失败";
            obj._data = {};
            callback(obj);
          }
        });

      }
      else {
        obj._code = "201";
        obj._msg = "查找失败";
        obj._data = {};
        callback(obj);
      }
    });

  }
  else{
    obj._code = "201";
    obj._msg = "查找失败..";
    obj._data = {};
    callback(obj);
  }
}

module.exports = {
  login,
  addAdminInfo,
  deleteAdmin,
  updateAdmin,
  getAdminList,
  getOrgInfoList,
  updateOrgInfo,
  delOrgInfo,
  deleteMedicalService,
  findMedicalServiceList,
  updateMedicalServcie,
  getLogList,
  getUserList,
  findUserInfo,
  updateUserInfo,
  deleteUser,
  getWalletInfo,
  isSuperAdmin,
  transferToUser,
  transfer,
  transactionRecord
}
