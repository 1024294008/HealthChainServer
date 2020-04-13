HealthChain后端

================



node v10.16.1+



###部署步骤

1、安装相关依赖

​		npm install

2、安装热启动命令

​		npm install -g nodemon



###启动命令

nodemon start



###目录结构描述

├─bin								    // 可执行成
├─build							    // 执行truffle生成的文件
│  └─contracts				    // truffle编译后的合约文件
├─config						      // 项目有关的配置文件
├─contracts				   	 // solidity合约
├─dao							     // 数据库访问层
├─db							       // mysql连接
├─middleware			      // 中间件
├─migrations				    // truffle部署合约脚本
├─models					      // 实体类
├─node_modules		    // node模块
├─public						    // 静态资源
│  ├─charts
│  ├─images
│  ├─javascripts
│  └─stylesheets
├─routes						   // controller路由
│  ├─admin
│  ├─common
│  ├─org
│  └─users
├─service					       // 业务逻辑
├─test					
├─utils						         // 自定义工具类
├─views						      // 视图
├─app.js						     // 项目配置
├─package.json		        // 相关依赖
├─readme.md			       // 使用说明 
└─truffle-config.js		    // truffle配置