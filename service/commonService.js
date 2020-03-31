var dao = require('../dao')

var obj = {
  _code: "",
  _msg: "",
  _data: {}
}

function getOrgInfo(req, callback){
  if(req.query){
    dao.orgDao.findByPrimaryKey(req.query.id,function(status, result){
      if(1 == status && result[0]){
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


module.exports = {
  getOrgInfo
}
