var db = require("../db/mysql")

var conn = db.connect()

function insert(params){
  var sql_insert = "insert into user_healthdata(userid, userType, uploadTime, eval, dataAddr, permitVisit) values(?,?,?,?,?,?)"

  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
     }
     console.log("插入成功~")
     return true;
  })
}

function deleteByPrimaryKey(params){
  var sql_delete = "delete from user_healthdata where id = ?"
  conn.query(sql_delete, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
    }
    console.log("删除成功");
    return true;
  })
}

// 查找最新一条数据
function findLatestData(params){
  var sql_select = "select * from user_healthdata where 1 = 1 and userid = ? and id in (select max(id) from user_healthdata)"
  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
     }
     console.log("查找成功~")
     return res;
  })
}

// 参数列表[userid, userType, uploadTime, eval, permitVisit]
function findByConditions(params){
  var sql_select = "insert into user_healthdata where 1 = 1"
  if(params[0] != "" && params[0] != null)
    sql_select += "and userid = ?"

  if(params[1] != "" && params[1] != null)
    sql_select += "or userType = ?"

  if(params[2] != "" && params[2] != null)
    sql_select += "or uploadTime = ?"

  if(params[3] != "" && params[3] != null)
    sql_select += "or eval = ?"

  if(params[4] != "" && params[4] != null)
    sql_select += "or permitVisit = ?"

  conn.query(sql_select, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
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
