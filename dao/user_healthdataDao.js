var db = require("../db/mysql")

var conn = db.connect()

function insert(params){
  var sql_insert = "insert into user_healthdata(userid, userType, uploadTime, eval, dataAddr, permitVisit) values(?,?,?,?,?,?)"

  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
     console.log("插入成功~")
     return true;
  })
}

// 查找最新一条数据
function findLatestData(params){
  var sql_select = "select * from user_healthdata where 1 = 1 and userid = ? and id in (select max(id) from user_healthdata)"
  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
     console.log("查找成功~")
     return res;
  })
}

// 参数列表[userid, userType, uploadTime, eval, permitVisit]
function findByConditions(params){
  var sql_select = "insert into user_healthdata where 1 = 1"
  if(userid != "" || userid != null)
    sql_select += "and userid = ?"

  if(userType != "" || userType != null)
    sql_select += "or userType = ?"

  if(uploadTime != "" || uploadTime != null)
    sql_select += "or uploadTime = ?"

  if(eval != "" || eval != null)
    sql_select += "or eval = ?"

  if(permitVisit != "" || permitVisit != null)
    sql_select += "or permitVisit = ?"

  conn.query(sql_select, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
      }
      console.log("查找成功~")
      return res;
  })
}


module.exports = {
  insert,
  findLatestData,
  findByConditions
}
