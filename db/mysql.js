var mysql = require('mysql');
var mysql_config = require('../config/db');
var db = {};

// 连接数据库，返回连接对象
db.connect = function(){
  var connection = mysql.createConnection(mysql_config);

  connection.connect(function(err){
    if(err){
      console.log(err);
      return;
    }
  });

  return connection;
};

// 关闭指定connection对象的连接
db.close = function(connection){
  connection.end(function(err){
    if(err){
      return;
    }else{
      console.log("close connection");
    }
  })
};

module.exports = db;
