var db = require("../db/mysql")

var conn = db.connect()

function insert(params){
  var sql_insert = "insert into log(operateId, operateDetails, operateTime, operateResult) values(?, ?, ?, ?)"
  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }
    console.log("插入成功~")
    return true
  })
}

function findAll(){
  var sql_select = "select * from log where 1 = 1"
  conn.query(sql_insert, "", function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }
    consoles.log("查找成功成功~")
    return res
  })
}

// 参数列表[operateTime, operateResult]
function findByConditions(params){
  var sql_select = "select * from log where 1 = 1"
  if(params[0] != "" || params[0] != null)
    sql_select += "and operateTime = ?"

  if(params[1] != "" || params[1] != null)
    sql_select += "or operateResult = ?"

  conn.query(sql_select, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }
    console.log("查找成功")
    return res
  })

}

module.exports = {
  insert,
  findAll,
  findByConditions
}
