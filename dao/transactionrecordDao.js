var db = require("../db/mysql")

var conn = db.connect()

function insert(params){
  var sql_insert = "insert into transactionrecord(sendAddress, recieveAddress, transactEth, transactTime, transactAddr, transactRemarks) values(?, ?, ?, ? ,? ,?)"

  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
    }
    console.log("插入成功");
    return false;
  })
}

function deleteByPrimaryKey(){
  var sql_delete = "delete from transactionrecord where id = ?"

  conn.query(sql_delete, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
    }
    console.log("删除成功");
    return true;
  })
}

function findByPrimaryKey(params){
  var sql_select = "select * from transactionrecord where 1 = 1 and id = ?"

  conn.query(sql_select, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
    }
    console.log("查找成功");
    return res;
  })
}

// 参数列表[sendAddress, recieveAddress, transactTime]
function findByConditions(params){
  var sql_select = "select * from transactionrecord where 1 = 1"
  if(params[0] != "" && params[0] != null)
    sql_select += "and recieveAddress = ?"

  if(params[1] != "" && params[1] != null)
    sql_select += "or sendAddress = ?"

  if(params[2] != "" && params[2] != null)
    sql_select += "or transactTime = ?"

  conn.query(sql_select, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return false;
    }
    console.log("查找成功");
    return res;
  })
}

module.exports = {
  insert,
  deleteByPrimaryKey,
  findByPrimaryKey,
  findByConditions
}
