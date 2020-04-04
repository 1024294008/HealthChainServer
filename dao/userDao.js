var db = require("../db/mysql")

var conn = db.connect()

function insert(params, callback){
  var sql_insert = 'insert into user set ?'
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
  var sql_delete = "delete from user where id = ?"
  conn.query(sql_delete, params, function(err, result){
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      callback(0)
      return;
     }
     console.log("删除成功~");
     callback(1);
  })
}

function updateByPrimaryKey(params, callback){
  var sql_update = "update user set ? where id = ?"
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
  var sql_select = "select * from user where id = ?"
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
  var sql_select = "select * from user where account = ?"
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

function findByEthAddress(params, callback){
  var sql_select = "select * from user where ethAddress = ?"
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

function findByConditionsCount(params, callback){
  var sql_select_count = 'select count(*) as allCount from user where 1 = 1 '  // 注意末尾空格

  console.log(sql_select_count)

  conn.query(sql_select_count, "",function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
      return;
     }
    console.log("条数查找成功~");
    callback(1, res);
  })
}

function findByConditions(params, callback){
  var sql_select = 'select * from user where 1 = 1 ' // 注意末尾空格

  sql_select += 'limit ' + params.limit*(params.page-1) + ',' + params.limit
  // sql_select += 'limit ?, ?';

  conn.query(sql_select, "",function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0, res);
      return;
     }
    console.log("查找成功~");
    callback(1, res);
  })
}

module.exports = {
  insert,
  deleteByPrimaryKey,
  updateByPrimaryKey,
  findByPrimaryKey,
  findByAccount,
  findByEthAddress,
  findByConditionsCount,
  findByConditions,
}
