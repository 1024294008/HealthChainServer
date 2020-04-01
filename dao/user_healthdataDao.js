var db = require("../db/mysql")

var conn = db.connect()

// 参数{用户健康数据关联 json}
function insert(params, callback){
  var sql_insert = "insert into user_healthdata set ?"

  conn.query(sql_insert, params, function(err, res){
    if(err){
      console.log('[INSERT ERROR] - ',err.message);
      callback(0);
      return;
     }
     console.log("插入成功~");
     callback(1);
  })
}

// 参数 id
function deleteByPrimaryKey(params, callback){
  var sql_delete = "delete from user_healthdata where id = ?"
  conn.query(sql_delete, [params], function(err, res){
    if(err){
      console.log('[DELETE ERROR] - ',err.message);
      callback(0);
      return;
    }
    console.log("删除成功");
    callback(1);
  })
}

// 查找最新一条数据 参数 userid
function findLatestData(params, callback){
  var sql_select = "select * from user_healthdata where 1 = 1 and userid = ? and id in (select max(id) from user_healthdata where userid = ?)"
  conn.query(sql_insert, [params, params], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
     }
     console.log("查找成功~");
     callback(1, res);
  })
}

// 根据id查找
function findByPrimaryKey(params, callback){
  var sql_select = 'select * from user_healthdata where 1 = 1 and id = ?'
  conn.query(sql_insert, [params], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
     }
     console.log("查找成功~");
     callback(1, res);
  })
}

// 查找自己所有的健康  userid
function findAllDateById(params, callback){
  var sql_select = 'select * from user_healthdata where 1 = 1 and userid = ?'
  conn.query(sql_insert, [params], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
     }
     console.log("查找成功~");
     callback(1, res);
  })
}

// 根据id  和 用户 id查询
function findByIdAndUserId(params, callback){
  var sql_select = 'select * from user_healthdata where 1 = 1 and id = ? and userid = ?'
  conn.query(sql_insert, [params], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
     }
     console.log("查找成功~");
     callback(1, res);
  })
}

// 参数列表{"userid": "", "userType": "", "uploadTime":"", "eval": "", "permitVisit": "", "limit": 1, "page": 2}
function findByConditionsCount(params, callback){
  var sql_select_count = 'select count(*) user_healthdata log where 1 = 1 '  // 注意末尾空格

  if(params.userid != "" && params.userid != null)
    sql_select_count += 'and userid = ' + '\"'  + params.userid + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.userType != "" && params.userType != null)
    sql_select_count += 'and userType = ' + '\"'  + params.userType + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.uploadTime != "" && params.uploadTime != null)
    sql_select_count += 'and uploadTime = ' + '\"'  + params.uploadTime + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.eval != "" && params.eval != null)
    sql_select_count += 'and eval = ' + '\"'  + params.eval + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.permitVisit != "" && params.permitVisit != null)
    sql_select_count += 'and permitVisit = ' + '\"'  + params.permitVisit + '\" ' // 字符串拼接需要引号，注意末尾空格

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

// 参数列表{"userid": "", "userType": "", "uploadTime":"", "eval": "", "permitVisit": "", "limit": 1, "page": 2}
function findByConditions(params, callback){
  var sql_select = 'select * from user_healthdata where 1 = 1 '

  if(params.userid != "" && params.userid != null)
    sql_select_count += 'and userid = ' + '\"'  + params.userid + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.userType != "" && params.userType != null)
    sql_select_count += 'and userType = ' + '\"'  + params.userType + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.uploadTime != "" && params.uploadTime != null)
    sql_select_count += 'and uploadTime = ' + '\"'  + params.uploadTime + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.eval != "" && params.eval != null)
    sql_select_count += 'and eval = ' + '\"'  + params.eval + '\" ' // 字符串拼接需要引号，注意末尾空格

  if(params.permitVisit != "" && params.permitVisit != null)
    sql_select_count += 'and permitVisit = ' + '\"'  + params.permitVisit + '\" ' // 字符串拼接需要引号，注意末尾空格

  sql_select += 'limit ?, ?';

  conn.query(sql_select, [params.limit*(params.page-1), params.limit], function(err, res){
    if(err){
      console.log('[FIND ERROR] - ',err.message);
      callback(0);
      return false;
    }
    console.log("查找成功")
    callback(1, res);
  })

}

module.exports = {
  insert,
  findLatestData,
  findAllDateById,
  findByPrimaryKey,
  findByConditions
}
