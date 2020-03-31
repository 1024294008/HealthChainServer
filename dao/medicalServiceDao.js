var db = require("../db/mysql")

var conn = db.connect()

function insert(params, callback){
  var sql_insert = 'insert into medicalservice set ?'
  conn.query(sql_insert, params, function(err, result){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      callback(0);
      return;
     }
     console.log("插入成功~")
     callback(1);
  })
}
function deleteByPrimaryKey(params, callback){
  var sql_delete = "delete from medicalservice where id = ?"
  conn.query(sql_delete, params, function(err, result){
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      callback(0)
      return;
     }
     console.log("删除成功~")
     callback(1)
  })
}

function updateByPrimaryKey(params, callback){
  var sql_update = "update medicalservice set ? where id = ?"
  conn.query(sql_update, params, function(err, result){
    if(err){
      console.log('[UPDATE ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("修改成功~")
    callback(1)
  })
}

function findByPrimaryKey(params, callback){
  var sql_select = "select * from medicalservice where id = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return;
     }
    console.log("查找成功")
    callback(1, result)
  })
}

function findByAccount(params, callback){
  var sql_select = "select * from medicalservice where account = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return;
    }
    console.log("查找成功")
    callback(1, result);
  })
}
/*
// 参数列表[authority]
function findByConditions(params){
  var sql_select = "select * from admin where 1 = 1"
  if(params != "")
    sql_select += "and authority = ?"
  conn.query(sql_select, params,function(err, res){

    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
    console.log("查找成功~")
    return res;
  })
}
*/
module.exports = {
  insert,
  deleteByPrimaryKey,
  updateByPrimaryKey,
  findByPrimaryKey,
  findByAccount,
  // findByConditions,
}
