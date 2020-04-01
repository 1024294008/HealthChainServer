var db = require("../db/mysql")

var conn = db.connect()

// {用户信息json}
function insert(params, callback){
  var sql_insert = "insert into admin set ?"
  conn.query(sql_insert, params, function(err, res){ // 异步调用，不能直接返回
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      callback(0, res);  // 调用回调之后才可以返回
      // return;
     }
     callback(1, res);
  })
}

// 参数 id
function deleteByPrimaryKey(params, callback){
  var sql_delete = "delete from admin where id = ?"
  conn.query(sql_delete, [params], function(err, res){
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      callback(0, res);
      return;
     }
     console.log("删除成功~");
     callback(1, res);
  })
}

// [{用户信息json}, id]
function updateByPrimaryKey(params, callback){
  var sql_update = "update admin set ? where id = ?"
  conn.query(sql_update, params, function(err, res){
    if(err){
      console.log('[UPDATE ERROR] - ',err.message);
      callback(0, res);
      return;
    }
    console.log("修改成功~");
    callback(1, res);
  })
}

// 参数 id
function findByPrimaryKey(params, callback){
  var sql_select = "select * from admin where id = ?"
  conn.query(sql_select, [params], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0, res);
      return;
     }
      console.log("管理员查找成功");
      callback(1, res);
  })
}

// 参数 account
function findByAccount(params, callback){
  var sql_select = "select * from admin where 1 = 1 and account = ?"
  conn.query(sql_select, [params],function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
      return;
     }
      console.log("管理员查找成功");
      callback(1, res);
  })
}

// 参数 ethAddress
function findByEthAddress(params, callback){
  var sql_select = 'select * from admin where 1 = 1 and ethAddress = ?'
  conn.query(sql_select, [params], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0, res);
      return;
    }
    console.log("管理员查找成功");
    callback(1, res);
  })
}

// 参数列表{"authority": "root", "limit": 1, "page": 2}
function findByConditionsCount(params, callback){
  var sql_select_count = 'select count(*) as allCount from admin where 1 = 1 '  // 注意末尾空格, 将数量命名为allCount方便使用

  if(params.authority != "" && params.authority != null)
    sql_select_count += 'and authority = ' + '\"'  + params.authority + '\" ' // 字符串拼接需要引号，注意末尾空格

  console.log(sql_select_count)

  conn.query(sql_select_count, "",function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0, res);
      return;
     }
      console.log("条数查找成功~");
      callback(1, res);
  })
}

// 参数列表{"authority": "root", "limit": 1, "page": 2}
function findByConditions(params, callback){
  var sql_select = 'select * from admin where 1 = 1 ' // 注意末尾空格

  if(params.authority != "" && params.authority != null)
    sql_select += 'and authority = ' + '\"'  + params.authority + '\" ' // 字符串拼接需要引号，注意末尾空格

  sql_select += 'limit ' + params.limit*(params.page-1) + ',' + params.limit
  // sql_select += 'limit ?, ?';

  console.log(sql_select)

  // conn.query(sql_select, [params.limit*(params.page-1), params.limit],function(err, res){
  conn.query(sql_select, "",function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0, res);
      return;
     }
      console.log("管理员查找成功");
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
