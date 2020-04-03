var dao = require('../dao')
var createToken = require('../middleware/createToken')

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
        req.body.ethAddress = '0x79dE40505C7518e0283E6c4f01067b9da35d81d4';
        req.body.privateKey = '0x08cEsdjkfsjdfjksldk849394j34jk34hj344j3k';
        req.body.certificateResult = '未审核';
        req.body.type = "其他";//默认是其他账户类型，认证通过才会变更类型为可提供服务的医疗机构类型
        req.body.contractAddr = "0x08cEsdjkfsjdfjksldk849394j34jk34hj344j3k";//账户合约部署地址

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
      }
    })
  }
}
//3更改机构的个人信息
function updateOrgInfo(req, callback){
  if(req.body.verify && req.body.verify.id){
    //只能修改头像(机构的图片)，机构名，机构简介
    if (req.body && req.body.portrait || req.body.organizationName || req.body.introductions) {
      //保存图片到服务器，再将路径记录下来




      if(req.body.organizationName){
        //把主键放进body
        req.body.id = req.body.verify.id;
        dao.orgDao.updateByPrimaryKey(req.body,function(status, result){
          if (1===status) {
            console.log(result)
            //说明修改成功
            obj._code = '200'
            obj._msg = '信息更新成功！'
            obj._data = {}
            callback(obj)
          }else{
            obj._code = '201'
            obj._msg = '账户名重复，请重新命名哦~'
            obj._data = {}
            callback(obj)
          }
        })
      }
      if(req.body.introductions){
        //把主键放进body

        dao.orgDao.updateByPrimaryKey(req.body,function(status, result){
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
      }
    } else {

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
  console.body("删除医疗服务");
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
    //从链上查看用户的购买剩余次数，扣除次数后进行下一步


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
    //拿到审核材料存到服务器本地，将路径存到数据库
    var fileAddr = "";




    dao.orgDao.updateByPrimaryKey('',function(status,result){
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
  updatePassword
}
