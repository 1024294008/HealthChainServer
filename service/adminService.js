var dao = require('../dao')
var createToken = require('../middleware/createToken')
var BigNumber = require("bignumber.js")
var dateUtil = require('../utils/dateUtil')
var filePath = require("../config/filePath")

var fs=require('fs');

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

log_param = {

  operateId: "",
  operateDetails: "",
  operateTime: "",
  operateResult: ""

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
  console.log(req.body)
  if(req.body && req.body.account && req.body.password && req.body.verify && req.body.verify.id && req.body.verify.id === 1){

    var admin = {
      account: req.body.account,
      password: req.body.password,
      authority: req.body.authority,
      ethAddress: "",  // 以太坊账户
      privateKey: "",  // 私钥
      contractAddr: "" // 合约地址
    }

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "root用户添加管理员";
    log_param.operateTime = dateUtil.format(new Date(), '-');

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
            admin.ethAddress = res.ethAddress;
            admin.privateKey = res.privateKey;
            admin.contractAddr = res.contractAddr

            dao.adminDao.insert(admin, function(st, re){
              if(1 === st){
                obj._code = "200";
                obj._msg = "注册成功";
                obj._data = {};
                callback(obj);

                log_param.operateResult = "操作成功";

                dao.logDao.insert(log_param, function(status, result){
                  if( 1 === status){
                    console.log("记录已经写入日志");
                  }
                  else
                  {
                    console.log("日志写入失败");
                  }
                })
              }
              else{

                log_param.operateResult = "操作成功";

                dao.logDao.insert(log_param, function(status, result){
                  if( 1 === status){
                    console.log("记录已经写入日志");
                  }
                  else
                  {
                    console.log("日志写入失败");
                  }
                })


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

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "root用户删除管理员, id:" + params;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    dao.adminDao.deleteByPrimaryKey(params, function(status, result){
      if( 1 === status ){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "root用户修改管理员, id:" + id;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    dao.adminDao.updateByPrimaryKey([admin, id], function(status, result){
      if( 1 === status ){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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

// 修改机构信息
function updateOrgInfo(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {}
    // 如果审核通过
    if(req.body.certificateResult === '审核通过'){
      params = {
        certificateResult: req.body.certificateResult
      }
    }
    // 如果审核未通过
    else{
      // 获取要删除的认证文件路径名
      var file = filePath.filePath
      dao.orgDao.findByPrimaryKey(req.body.id, function(s, r){
        if(1 === s && r[0]){
          file += r[0].certificateFiles
          console.log(file)
          // 删除认证文件
          fs.unlinkSync(file);
        }
      })

      // 将认证文件置空
      params = {
        certificateResult: req.body.certificateResult,
        certificateFiles: ""
      }
    }

    var id = req.body.id;

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "管理员审核机构, id:" + id + ", 审核结果: " + req.body.certificateResult;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    dao.orgDao.updateByPrimaryKey([params, id], function(status, result){
      if( 1 === status){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "管理员删除机构, id:" + id;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    dao.orgDao.deleteByPrimaryKey([id], function(status, result){  // 这里的参数要给成[]
      if( 1 === status){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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

  if(req.body && req.body.verify && req.body.verify.id){
    var id = req.body.id;

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "管理员删除服务, id:" + id;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    dao.medicalServiceDao.deleteByPrimaryKey(id, function(status, result){
      if( 1 === status){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "管理员审核服务, id:" + id + ", 审核结果: " + req.body.certificateResult;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    dao.medicalServiceDao.updateByPrimaryKey([params, id], function(status, result){
      if( 1 === status){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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
function getBlockInfo(req, callback){
    console.log("区块信息")
    console.log(req.query)
    if(req.query && req.query.num){
      dao.adminEthDao.getBlockInfo(req.query.num, function(status, result){
        if(1 === status){
          obj._code = '200'
          obj._msg = '查询成功'
          obj._data = result
          callback(obj)
        } else{
          obj._code = '201'
          obj._msg = '查询失败'
          obj._data = {}
          callback(obj)
        }
      })
    } else {
      obj._code = '201'
      obj._msg = '查询失败'
      obj._data = {}
      callback(obj)
    }
  }

// 获取挖矿信息
function getMinerInfo(req, callback){
    dao.adminEthDao.getMinerInfo(function(status, result){
      if(1 === status){
        obj._code = '200'
        obj._msg = '查询成功'
        obj._data = result
        callback(obj)
      } else{
        obj._code = '201'
        obj._msg = '查询失败'
        obj._data = {}
        callback(obj)
      }
    })
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

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "管理员修改用户信息, id:" + id;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    console.log(log_param);

    dao.userDao.updateByPrimaryKey([params, id], function(status, result){
      if( 1 === status){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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

    log_param.operateId = req.body.verify.id;
    log_param.operateDetails = "管理员修改用户信息, id:" + id;
    log_param.operateTime = dateUtil.format(new Date(), '-');

    dao.userDao.deleteByPrimaryKey([id], function(status, result){
      if( 1 === status){

        log_param.operateResult = "操作成功";

        dao.logDao.insert(log_param, function(status, result){
          if( 1 === status){
            console.log("记录已经写入日志");
          }
          else{
            console.log("日志写入失败");
          }
        })

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
    dao.ethDao.getBalance(ethAddress, function(status, result){
      if( 1 === status)
      {
        obj._code = "200";
        obj._msg = "余额获取成功";
        obj._data.balance = result;
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

// 管理员转账，   可以向用户、机构、管路员转账
function transferToUser(req, callback){
  if(req.body && req.body.verify && req.body.verify.id ){
    var receiverEthAddr = req.body.receiverEthAddr;
    var value = new BigNumber(req.body.value);
    dao.ethDao.transferToUser(receiverEthAddr, value, function(status){
      if( 1 === sta){
        var record = {
          sendAddress: req.body.sendAddress,  // 发送方地址
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
          console.log("进入到转账函数.." + sta)
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

// 查看交记录    ---   转账记录
function transactionRecord(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      sendAddress: req.body.sendAddress,       // 发送方是自己
      recieveAddress: req.body.sendAddress,    // 接受放也是自己
      transactRemarks: "",
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

// 查看转账记录 --- 根据备注（交易类型查看）
function transactionRecordByType(req, callback){
  if(req.body && req.body.verify && req.body.verify.id){
    var params = {
      sendAddress: req.body.sendAddress,       // 发送方是自己
      recieveAddress: "",
      transactRemarks: req.body.transactRemarks, // 备注（交易类型）
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

// 合约参数
var contractInfo = {
  "payforHealthData": 0,      // 单次授权消耗的以太币
  "validSection": 0,          // 授权有效时间间隔
  "uploadSection": 0,         // 上传有效时间间隔
  "award": 0                  // 用户上传数据可获得的奖励
}

// 查看合约参数
function getContractInfo_payforHealthData(req, callback){
  dao.adminEthDao.getPayforHealthData(function(status, result){
    if( 1 === status){
      contractInfo.payforHealthData = result
      obj._code = "200";
      obj._msg = "合约参数查找成功.. 单次授权消耗的以太币";
      obj._data = contractInfo;
      callback(obj);
    }
  })
}

function getContractInfo_validSection(req, callback){
  dao.adminEthDao.getValidSection(function(status, result){
    if( 1 === status){
      contractInfo.validSection = result
      obj._code = "200";
      obj._msg = "合约参数查找成功.. 授权有效时间间隔";
      obj._data = contractInfo;
      callback(obj);
    }
  })

}

function getContractInfo_uploadSection(req, callback){
  dao.adminEthDao.getUploadSection(function(status, result){
    if( 1 === status){
      contractInfo.uploadSection = result
      obj._code = "200";
      obj._msg = "合约参数查找成功.. 上传有效时间间隔";
      obj._data = contractInfo;
      callback(obj);
    }
  })
}


function getContractInfo_award(req, callback){
  dao.adminEthDao.getAward(function(status, result){
    if( 1 === status){
      contractInfo.award = result
      obj._code = "200";
      obj._msg = "合约参数查找成功.. 奖励";
      obj._data = contractInfo;
      callback(obj);
    }
  })

}

// 设置合约参数
function setContractInfo_payforHealthData(req, callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.verify.id === 1){
      dao.adminEthDao.setPayforHealthData(req.body.payforHealthData, function(status){
        if( 1 === status){
          console.log("单次授权消耗的以太币参数设置成功");
          obj._code = "200";
          obj._msg = "合约参数设置成功";
          obj._data = {};
          callback(obj);
        }
      })
  }
  else{
    obj._code = "201";
    obj._msg = "合约参数设置失败";
    obj._data = {};
    callback(obj);
  }
}

  function setContractInfo_validSection(req, callback){
    if(req.body && req.body.verify && req.body.verify.id && req.body.verify.id === 1){
      dao.adminEthDao.setValidSection(req.body.validSection, function(status){
        console.log("授权时间参数设置成功");
        obj._code = "200";
        obj._msg = "合约参数设置成功";
        obj._data = {};
        callback(obj);
      })
      }
      else{
        obj._code = "201";
        obj._msg = "合约参数设置失败";
        obj._data = {};
        callback(obj);
      }
}

  function setContractInfo_uploadSection(req, callback){
    console.log(contractInfo)
    console.log(req.body.uploadSection)
    if(req.body && req.body.verify && req.body.verify.id && req.body.verify.id === 1){
      dao.adminEthDao.setUploadSection(req.body.uploadSection, function(status){
        console.log("上传数据时间间隔参数设置成功");
        obj._code = "200";
        obj._msg = "合约参数设置成功";
        obj._data = {};
        callback(obj);
      })
  }
  else{
    obj._code = "201";
    obj._msg = "合约参数设置失败";
    obj._data = {};
    callback(obj);
  }
}

  function setContractInfo_award(req, callback){
    if(req.body && req.body.verify && req.body.verify.id && req.body.verify.id === 1){
      console.log("修改奖励金额.......")
        dao.adminEthDao.setAward(req.body.award, function(status){
          console.log("上传数据奖励参数设置成功");
          obj._code = "200";
          obj._msg = "合约参数设置成功";
          obj._data = {};
          callback(obj);
        })
    }
    else{
      obj._code = "201";
      obj._msg = "合约参数设置失败";
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
  getBlockInfo,
  getMinerInfo,
  getWalletInfo,
  isSuperAdmin,
  transferToUser,
  transfer,
  transactionRecord,
  transactionRecordByType,
  getContractInfo_payforHealthData,
  getContractInfo_uploadSection,
  getContractInfo_validSection,
  getContractInfo_award,
  setContractInfo_payforHealthData,
  setContractInfo_uploadSection,
  setContractInfo_validSection,
  setContractInfo_award
}
