var db = require("../db/mysql")

var conn = db.connect()

function insert(){

  var sql_insert = "insert into admin(account,password,ethAddress,authority) values(?,?,?,?)"
  var params = ["789", "123", "567", "567"]
  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
     console.log(res)
  })
}

function deleteByPrimaryKey(params){
  var sql_delete = "delete from damin where id = ?"
  conn.query(sql_delete, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
  })
}

function updateByPrimaryKey(params){
  var sql_update = "update admin set password = ? where id = id"
  conn.query(sql_update, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
    }
    console.log(res)
  })
}

function findByPrimaryKey(params){
  var sql_select = "select * from admin where id = ?"
  conn.query(sql_select, params, function(err, res){

    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
    console.log(res)
  })
}

function findByAccount(params){
  var sql_select = "select * from admin where account = ?"

  conn.query(sql_select, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
    console.log(res)

  })
}

function findByConditions(){
  var sql_select = "select * from admin where 1 = 1"
  var params = ""
  conn.query(sql_select, params,function(err, res){

    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      return;
     }
    // console.log(res[0].RowDataPacket)
    // console.log(res)
    for(var i =0; i<3; i++){
      console.log(res[i])
    }
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
