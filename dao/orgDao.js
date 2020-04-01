var db = require("../db/mysql")

var conn = db.connect()

// 添加机构用户
function insert(params, callback){
  var sql_insert = 'insert into organization set ?'
  conn.query(sql_insert, params, function(err, result){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      callback(0)
      return
    }
    console.log("插入成功~")
    callback(1);
  })
}


// 删除机构用户
function deleteByPrimaryKey(params, callback){
  var sql_delete = "delete from organization where id = ?"
  conn.query(sql_delete, params, function(err,result){
    if(err){
      console.log('[DELETE ERROR]-', err.message)
      callback(0)
      return
    }
    console.log("删除成功~")
    callback(1)
  })
}


// 更新机构用户的审核状态 参数[certificateResult, id]
function updateByPrimaryKey(params, callback){
  var sql_update = "update organization set certificateResult = ? where id = ?"
  conn.query(sql_update, params, function(err,result){
    if(err){
      console.log('[UPDATE ERROR]-', err.message)
      callback(0)
      return
    }
    console.log("修改成功")
    callback(1)
  })
}

// 根据主键查询
function findByPrimaryKey(params, callback){
  var sql_select = "select * from organization where id = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return
     }
    console.log("查询成功")
    callback(1, result)
  })
}

// 根据账号查询
function findByAccount(params, callback){
  var sql_select = "select * from organization where account = ?"
  conn.query(sql_select, params, function(err, result){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0)
      return
     }
    console.log("查询成功")
    callback(1, result)
  })
}

// 参数列表{"certificateResult": "已通过", "limit": 1, "page": 2}
function findByConditions(params, callback){
  var sql_select = 'select * from admin where 1 = 1 ' // 注意末尾空格

  if(params.authority != "" && params.authority != null)
    sql_select += 'and certificateResult = ' + '\"'  + params.certificateResult + '\" ' // 字符串拼接需要引号，注意末尾空格

  sql_select += 'limit ?, ?';

  conn.query(sql_select, [params.limit*(params.page-1), params.limit],function(err, result){

    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
      return;
    }
    console.log("查找成功~");
    callback(1, result)
  })
}

module.exports = {
    insert,
    deleteByPrimaryKey,
    updateByPrimaryKey,
    findByPrimaryKey,
    findByAccount,
    findByConditions
}
