var db = require("../db/mysql")

var conn = db.connect()

function insert(params){
  var sql_insert = "insert into admin(account,password,ethAddress,authority) values(?,?,?,?)"
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
  var sql_delete = "delete from damin where id = ?"
  conn.query(sql_delete, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
     }
     console.log("删除成功~")
     return true;
  })
}

function updateByPrimaryKey(params){
  var sql_update = "update admin set password = ? where id = id"
  conn.query(sql_update, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
    }
    console.log("修改成功~")
    return true;
  })

}

function findByPrimaryKey(params){
  var sql_select = "select * from admin where id = ?"
  conn.query(sql_select, params, function(err, res){

    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
     }
    console.log("查找成功")
    return res;
  })
}


function findByAccount(params){
  var sql_select = "select * from admin where account = ?"
  conn.query(sql_select, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
     }
     console.log("查找成功")
    return res;
  })
}

// 参数列表[authority]
function findByConditions(params){
  var sql_select = "select * from admin where 1 = 1"
  if(params[0] != "" && params[0] != null)
    sql_select += "and authority = ?"
  conn.query(sql_select, params,function(err, res){

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
  deleteByPrimaryKey,
  updateByPrimaryKey,
  findByPrimaryKey,
  findByAccount,
  findByConditions,
}
