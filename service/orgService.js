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

// 1第三方登录
function login(req, callback){
  if(req.body && req.body.account && req.body.password){
    dao.orgDao.findByAccount(req.body.account, function(status, result){
      // 验证登录
      if(1 === status && result[0] && result[0].password === req.body.password){
        obj._code = '200'
        obj._msg = '登录成功'
        obj._data.token = createToken({id: result[0].id, type: result[0].type})
        delete result[0].password
        delete result[0].privateKey
        delete result[0].contractAddr
        obj._data.userInfo = JSON.stringify(result[0])
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

// 2第三方注册
function register(req, callback){
  //必须先给出账户名，密码，组织名称
  if(req.body && req.body.account && req.body.password && req.body.organizationName){
    //首先排除账户名重复
    dao.orgDao.findByAccount(req.body.account,function(status, result){
      if (1===status && result.length>0) {
        console.log(result)
        //说明账户已经存在
        obj._code = '201'
        obj._msg = '账户名重复，请重新命名哦~'
        obj._data = {}
        callback(obj)
      }else{
        //账户不存在，注册！
        dao.ethDao.createAccout(function(sta, res){
          if( 1 === sta){
            req.body.ethAddress = res.ethAddress;
            req.body.privateKey = res.privateKey;
            req.body.certificateResult = '未上传';
            req.body.type = "普通";//默认是其他账户类型，认证通过才会变更类型为可提供服务的医疗机构类型
            req.body.contractAddr = res.contractAddr;//账户合约部署地址

            dao.orgDao.insert(req.body,function(status, result){
              if(1===status){
                //注册成功
                obj._code = '200'
                obj._msg = '注册成功，可以登录啦！'
                obj._data = {}
                callback(obj)
              }else{
                //注册过程出现失败
                obj._code = '201'
                obj._msg = '注册失败，请重试！'
                obj._data = {}
                callback(obj)
              }
            })
          }else{
            //注册过程出现失败
            obj._code = '201'
            obj._msg = '以太网连接错误导致注册失败，请重试！'
            obj._data = {}
            callback(obj)
          }
        })

      }
    })
  }
}
//3更改机构的个人信息
function updateOrgInfo(req, callback){
  if(req.body.verify && req.body.verify.id && req.body.stop=="1"){
    //只能修改头像(机构的图片)，机构名，机构简介，机构账号
    if (req.body && req.body.portrait || req.body.organizationName || req.body.introduction) {
      //保存图片到服务器，再将路径记录下来
      var json_updateOrgInfo;
      if (null == req.body.portrait) {
        //说明没有修改图片
        json_updateOrgInfo = {
          organizationName:req.body.organizationName,
          introduction:req.body.introduction,
          account:req.body.account
        }
      }else{
        json_updateOrgInfo = {
          pic:req.body.portrait,
          organizationName:req.body.organizationName,
          introduction:req.body.introduction,
          account:req.body.account
        }
      }

      console.log(json_updateOrgInfo)
      dao.orgDao.updateByPrimaryKey([json_updateOrgInfo,req.body.verify.id],function(status, result){
        if (1===status) {
          console.log(result)
          //说明修改成功
          obj._code = '200'
          obj._msg = '信息更新成功！'
          obj._data = {}
          callback(obj)
        }else{
          obj._code = '201'
          obj._msg = '修改失败，请重试哦~'
          obj._data = {}
          callback(obj)
        }
      })
    } else {
      obj._code = '201'
      obj._msg = '信息不符合规范！'
      obj._data = {}
      callback(obj)
    }
  }
}
//4机构获取自己的服务列表
//要分页
function getMedicalServiceList(req,callback){
  if(req.body.verify && req.body.verify.id){
    var json_getMyService = {
      "oid":req.body.verify.id,
      "page":req.body.page,
      "limit":req.body.limit
    }
    dao.orgDao.findByConditionsCount(json_getMyService,function(status1,result1){
      if (1===status1) {
        //说明获取到了总数,继续获取分页数据
        var allCount = result1[0].allCount;

        dao.medicalServiceDao.findByConditions(json_getMyService,function(status2,result2){
          if (1===status2) {
            //说明获取成功
            var jsonResult = {
              code:0,
              msg:'',
              count:allCount,
              data:result2
            }
            callback(jsonResult)
          }else{
            obj._code = '201'
            obj._msg = '获取数据失败'
            obj._data = {}
            callback(obj)
          }
        })
      }else{
        obj._code = '201'
        obj._msg = '出错了，请重试哦~'
        obj._data = {}
        callback(obj)
        return;
      }
    });

  }
}
//5注册服务
function insertMedicalService(req,callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.serviceName && req.body.serviceDetails && req.body.cost){

    var json_insertService = {
      oid:req.body.verify.id,
      auditResult:"审核中",
      serviceName:req.body.serviceName,
      serviceDetails:req.body.serviceDetails,
      cost:req.body.cost
    }
    dao.medicalServiceDao.insert(json_insertService,function(status,result){
      if (1 == status) {
        obj._code = '200'
        obj._msg = '注册服务成功'
        obj._data = {}
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '注册服务失败'
        obj._data = {}
        callback(obj)
      }
    })
  }
}
//6机构修改自己的某个医疗服务
function updateMedicalService(req,callback){
  //服务的id不能空
  if(req.body && req.body.verify && req.body.verify.id && req.body.id){
    var json_updateService = {
      serviceName:req.body.serviceName,
      serviceDetails:req.body.serviceDetails,
      cost:req.body.cost
    }
    dao.medicalServiceDao.updateByPrimaryKey([json_updateService,req.body.id],function(status,result){
      if (1 == status) {
        obj._code = '200'
        obj._msg = '修改服务成功'
        obj._data = {}
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '修改服务失败'
        obj._data = {}
        callback(obj)
      }
    })
  }
}
// 删除医疗服务
function delMedicalService(req,callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.id){
    dao.medicalServiceDao.deleteByPrimaryKey(req.body.id,function(status,result){
      if (1 == status) {
        obj._code = '200'
        obj._msg = '删除服务成功'
        obj._data = {}
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '删除服务失败'
        obj._data = {}
        callback(obj)
      }
    })
  }
}
//8
function buyHealthData(req,callback){
  if(req.body && req.body.verify && req.body.verify.id){
    //


    //按照上传时间降序查看，注意只取到允许授权的
    req.body.permitVisit = 1;
    dao.user_healthdataDao.findByConditions(req.body.permitVisit,function(status,result){
      //拿到全部的授权访问的交易地址
      if (1 == status) {
        //拿着所有交易地址逐条去区块链取数据，逐条存进一个excel文件，返回到这个文件的下载地址


        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '删除服务失败'
        obj._data = {}
        callback(obj)
      }
    })
  }
}
//9
function audit(req,callback){
  if(req.body && req.body.verify && req.body.verify.id){
    //审核材料已经在路由层存到服务器本地，此时只需将路径存到数据库
    var date = new Date(Date.now());
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth()+1 < 10 ? (date.getMonth()+1) : date.getMonth()+1) + '/';
    var D = date.getDate();
    var auditTime = Y+M+D
    var json_audit = {
      certificateFiles:req.body.fileName,
      certificateTime:auditTime,
      certificateResult:"审核中"
    }
    dao.orgDao.updateByPrimaryKey([json_audit, req.body.verify.id],function(status,result){
      if (1 == status) {
        obj._code = '200'
        obj._msg = '上传审核材料成功'
        obj._data = {}
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '上传审核材料失败'
        obj._data = {}
        callback(obj)
      }
    })
  }
}
//10
function getMyInfo(req,callback){
  if(req.body.verify && req.body.verify.id){
    dao.orgDao.findByPrimaryKey(req.body.verify.id,function(status,result){
      if (1 == status) {
        obj._code = '200'
        obj._msg = '获取机构信息成功'
        delete result[0].password
        delete result[0].id
        delete result[0].privateKey
        obj._data = result[0]
        callback(obj)
      } else {
        obj._code = '201'
        obj._msg = '获取机构信息失败'
        obj._data = {}
        callback(obj)
      }
    })
  }
}
//11
function updatePassword(req,callback){
  if(req.body && req.body.verify && req.body.verify.id && req.body.password && req.body.newPassword){
    dao.orgDao.findByPrimaryKey(req.body.verify.id,function(status,result){
      if (1 == status) {
        //拿到用户原始信息
        if(req.body.password == result[0].password){
          //允许修改
          var json_password = {
            password:req.body.newPassword
          }
          dao.orgDao.updateByPrimaryKey([json_password,req.body.verify.id],function(_status,_result){
            if (1 == status) {
              obj._code = '200'
              obj._msg = '修改密码成功'
              obj._data = []
              callback(obj)
            } else {
              obj._code = '201'
              obj._msg = '修改密码失败'
              obj._data = {}
              callback(obj)
            }
          })
        }else{
          //不允许修改
          obj._code = '201'
          obj._msg = '原密码错误！'
          obj._data = {}
          callback(obj)
        }
      } else {
        //查询通过id查找原密码的过程中出现失败
        obj._code = '201'
        obj._msg = '出现错误，请重试！'
        obj._data = {}
        callback(obj)
      }
    })
  }
}
//12转账
function transfer(req,callback){
  console.log(req.body.receiverEthAddr+":"+req.body.value+":"+req.body.transactRemarks)
  if(req.body && req.body.verify && req.body.verify.id && req.body.receiverEthAddr && req.body.value){
    dao.orgDao.findByPrimaryKey(req.body.verify.id, function(status, result){
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
//13 getBalance获取余额
function getBalance(req,callback){
  if(req.body && req.body.verify && req.body.verify.id){

    var ethAddress = req.body.ethAddress;
    console.log(ethAddress)
    dao.ethDao.getBalance(ethAddress, function(status, result){
      console.log(result)
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
//14 取得用户列表，判断每一个用户的授权信息
function getAllUsers(req,callback){
  if(req.body.verify && req.body.verify.id){
    var json_getAllUsers = {
      "page":req.body.page,
      "limit":req.body.limit
    }
    dao.userDao.findByConditionsCount(json_getAllUsers,function(status1,result1){
      if (1===status1) {
        //说明获取到了总数,继续获取分页数据
        var allCount = result1[0].allCount;
        console.log("查到的总数："+allCount)
        dao.userDao.findByConditions(json_getAllUsers,function(status2,result2){
          if (1===status2) {
            //说明获取成功
            // for(let i=0;i<result2.length;i++){
            //   dao.ethDao.getPublicHealthCount(result2[i].contractAddr,function(_sta,_res){
            //     console.log(_res)
            //     result2[i].sum = _res
            //   })
            //   dao.ethDao.getAuthInfo(ethAddress,result2[i].contractAddr,function(_sta,_res){
            //     if (_res>0) {
            //       result2[i].paid = "1"
            //     } else {
            //       result2[i].paid = "0"
            //     }
            //   })
            // }
            // for(var i = 0; i < result2.length; i ++){
            //   (function(i){
            //     dao.ethDao.getPublicHealthCount(result2[0].contractAddr,function(_sta,_res){
            //           console.log(_res)
            //           result2[0].sum = _res
            //         })
            //         dao.ethDao.getAuthInfo(ethAddress,result2[0].contractAddr,function(_sta,_res){
            //           if (_res>0) {
            //             result2[0].paid = "1"
            //           } else {
            //             result2[0].paid = "0"
            //           }
            //         })

            //   })(i)
            // }
            // result2.forEach(item =>{
            //   //作用域居然这么窄
            //   dao.ethDao.getPublicHealthCount(item.contractAddr,function(_sta,_res){
            //     console.log(_res)
            //     item.sum = _res
            //   })
            //   dao.ethDao.getAuthInfo(ethAddress,item.contractAddr,function(_sta,_res){
            //     if (_res>0) {
            //       item.paid = "1"
            //     } else {
            //       item.paid = "0"
            //     }
            //   })
            // })
            // console.log(JSON.stringify(result2))
            var jsonResult = {
              code:0,
              msg:'',
              count:allCount,
              data:result2
            }
            callback(jsonResult)
          }else{
            obj._code = '201'
            obj._msg = '获取数据失败'
            obj._data = {}
            callback(obj)
          }
        })
      }else{
        obj._code = '201'
        obj._msg = '出错了，请重试哦~'
        obj._data = {}
        callback(obj)
        return;
      }
    });

  }
}
//15 得到用户授权
//参数：token,目标用户contractAddr，目标用户id,目标用户ethAddress
function getUserAuth(req, callback){
if(req.body.verify && req.body.verify.id && req.body && req.body.id && req.body.contractAddr && req.body.ethAddress){
  dao.orgDao.findByPrimaryKey(req.body.verify.id, function(status, result){
    dao.ethDao.authToOrg(result[0].organizationName,result[0].privateKey,req.body.contractAddr,200000000000000000,function(_status,_result){
      console.log("授权状态："+_status)
      if( 1 === _status){
        var json_trans = {
          sendAddress:result[0].ethAddress,
          recieveAddress:req.body.ethAddress,
          transactEth:200000000000000000,
          transactTime:Date.now(),
          transactRemarks:"机构获取授权"
        }
        dao.transactionrecordDao.insert(json_trans,function(status_,result_){
          if( 1 === status_)
          {
            var json_visit = {
              userId:req.body.id,
              visitorId:req.body.verify.id,
              visitTime:dateUtil.format(new Date(), '-')
            }
            dao.visitorrecordDao.insert(json_visit,function(sta,res){
              if( 1 === sta){
                obj._code = "200";
                obj._msg = "授权成功！";
                obj._data= res;
                callback(obj);
              }else{
                obj._code = "201";
                obj._msg = "授权失败";
                obj._data= {};
                callback(obj);
              }
            })
          }
          else{
            obj._code = "201";
            obj._msg = "插入交易记录失败";
            obj._data = {};
            callback(obj);
          }
        })
      }
      else{
        obj._code = "201";
        obj._msg = "获取授权失败，请检查账户余额是否充足！";
        obj._data = {};
        callback(obj);
      }
    })
  })
}
}
//16已经获取授权的用户直接查看用户的数据
//参数：机构的ethAddress
function getAllHealthData(req,callback){
if(req.body.verify && req.body.verify.id && req.body && req.body.ethAddress){
  //通过交易记录表查当前机构的付款记录,t通过交易记录拿到已经付款的用户的列表
  dao.transactionrecordDao.findBysendAddress(req.body.ethAddress,function(status,result){
    for(var i = 0; i < result.length; i++){
      //扫描用户列表，逐个获得用户信息
      dao.userDao.findByEthAddress(result[i].recieveAddress,function(status1,result1){
        //拿到了用户信息，取出该用户的全部公开数据
        //验证一下用户对该机构的授权情况
        dao.ethDao.getAuthInfo([ethAddress,result2[i].contractAddr],function(_sta,_res){
          if (_res>0) {
            //剩余时间>0，说明已经获得授权且在授权时间内
            dao.ethDao.getHealthCount(result1[i].contractAddr, function(status, count){
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
                    dao.ethDao.getHDataByIndex(i, req.body.ethAddress, result1[i].contractAddr, function(status, result){
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
                obj._msg = '查询失败'
                obj._data = {}
                callback(obj)
              }
            })
          }
        })

      })
    }
  })
}}
//17获取用户的健康数据数量
function getUserHealthDataCount(req,callback){
if(req.body.verify && req.body.verify.id && req.body && req.body.contractAddr){
  dao.ethDao.getPublicHealthCount(req.body.contractAddr,function(status,result){
    if( 1 === status){
      console.log("查找到:"+result)
      obj._code = "200";
      obj._msg = "获取总数成功";
      obj._data = result;
      callback(obj);
    }else{
      obj._code = "201";
      obj._msg = "获取总数失败..";
      obj._data = {};
      callback(obj);
    }
  })
}
}
//18获取用户对当前机构的授权与否
//参数：目标用户的合约地址
function authFromUser(req,callback){
if(req.body.verify && req.body.verify.id && req.body && req.body.contractAddr){
  dao.orgDao.findByPrimaryKey(req.body.verify.id, function(status, result){
    dao.ethDao.getAuthInfo(result[0].ethAddress, req.body.contractAddr,function(_sta,_res){
      console.log("这是机构拿到授权的凭证："+_res)
      if (_sta===1) {
        //成功获取授权状态，判断授权时间
        if (_res>0) {
          obj._code = "200";
          obj._msg = "授权中";
          obj._data = "1";
          callback(obj);
        }else{
          obj._code = "200";
          obj._msg = "未授权";
          obj._data = "0";
          callback(obj);
        }
      } else {
        obj._code = "201";
        obj._msg = "获取授权状态失败";
        obj._data = "0";
        callback(obj);
      }
    })
  })

}
}
//19得到机构的转账记录
function getTransferHistory(req,callback){
  if(req.body && req.body.verify && req.body.verify.id){
    dao.orgDao.findByPrimaryKey(req.body.verify.id, function(status, result){
      var params = {
        sendAddress: result[0].ethAddress,
        recieveAddress: result[0].ethAddress,
        limit: req.body.limit,
        page: req.body.page
      }
      dao.transactionrecordDao.findByConditionsCount(params, function(status, result){
        if( 1=== status && result[0]){
          var res_json = {
            code: 0,
            msg: '',
            count: 0,
            data: []
          }
          res_json.count = result[0].allCount;
          dao.transactionrecordDao.findBysendAddressOrrecieveAddress(params, function(st, re){
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
  register,
  updateOrgInfo,
  getMedicalServiceList,
  insertMedicalService,
  updateMedicalService,
  delMedicalService,
  buyHealthData,
  audit,
  getMyInfo,
  updatePassword,
  transfer,
  getBalance,
  getAllUsers,
  getUserAuth,
  getAllHealthData,
  getUserHealthDataCount,
  authFromUser,
  getTransferHistory
}
