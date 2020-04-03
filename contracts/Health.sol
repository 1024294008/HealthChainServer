pragma solidity >=0.4.21 <0.7.0;

// 声明其他合约的接口  -- 授权合约
interface AdminContract{
    function getAdminAddress()  external view returns(address);
    function gethealthDataCount() external view returns(uint32);
}

contract Health{
    // 上链的数据结构
    struct H_Data{   // 需要可以增加时间点
        string      heartRate;    // 心跳
        string		heat;		  // 消耗热量
        string		sleepQuality; // 睡眠质量
        string      distance;     // 步数
        string      temperature;  // 体温
        string		bloodPressure;// 血压
        uint32		age;		  // 年龄
        string		local;		  // 地区
        string		evaluation;   // 评论
        string		uploadTime;	  // 上传时间
    }

    struct User_Info{
        address    owner;         // 数据拥有者
        uint32     visitCount;    // 总访问次数
    }

    struct Visitor{
        string    organizationName; // 数据访问者
        uint32    visitCount;       // 数据访问者访问次数
    }

    // 拥有者信息
    User_Info          user;
    // 上链数据
    H_Data[]           h_data;
    // 授权用户
    mapping(address => Visitor) public visitors;


    // 其他合约地址
    address adminContractAddr;
    // 其他合约实例
    AdminContract adminContract;


    // 构造器：初始化时需要拥有者信息
    constructor(address _owner, address _adminContractAddr) public{
        // 初始化拥有者信息
        user.owner = _owner;
        adminContractAddr = _adminContractAddr;
        adminContract = AdminContract(adminContractAddr);   // 通过地址拿到合约实例   --  将地址强制转换为合约
    }

    // 查询用户信息
    function getUserInfo() public view returns (uint32 memory visitCount, address memory owner){
        // 可以考虑授权限制
        visitCount = user.visitCount;
        owner = user.owner;
    }

    // 更新链上数据
    function addData(string heartRate,string heat,string sleepQuality,string distance,string temperature,string bloodPressure,uint32 age,string local,string evaluation,string uploadTime) public {
        // 可以考虑授权限制
        // 创建一个数据记录
        H_Data memory item = H_Data(
            {
                heartRate: heartRate,    
				heat: heat,		  
				sleepQuality: sleepQuality, 
				distance: distance,     
				temperature:temperature,  
				bloodPressure: bloodPressure,
				age: age,		  
				local: local,		  
				evaluation: evaluation,   
				uploadTime: uploadTime,	  
            });
        h_data.push(item);
    }

    // 用户访问健康数据   --  根据下标
    function getHDataByIndex(uint idx) public view returns (H_Data data) {

    	// 判断下标
        require(idx < h_data.length, "访问异常");

        // 权限控制
        require(visitors[msg.sender].visitCount > 0 || msg.sender == user.owner, "没有访问权限");
        // 增加计数
        // 自己实现了 ----------------

        // 判断是否是机构访问
        if(visitors[msg.sender].visitCount > 0){
        	visitors[msg.sender].visitCount -= 1;
        }
        
        return h_data[idx];
        
    }

    // 用户访问健康数据   --  返回全部数据   --  只有用户访问
    function getHData() public view returns (H_Data[] data) {

        // 权限控制
        require( msg.sender == user.owner, "没有访问权限");
        // 增加计数
        // 自己实现了 ----------------
        // 返回数据
        return h_data;
        
    }


    //
    function  getRecordCount() public view  returns(uint256 len){
        len = h_data.length;
    }

    // 授权用户访问   ---   管理员代替授权
    // function authToUser(address to, string memory name) public{
    //     // 只有拥有者可以授权
    //     require(
    //         msg.sender == adminContract.getAdminAddress(),
    //         "只有管理员可以授权！"
    //     );
    //     visitors[to].name = name;
    //     visitors[to].visitCount += 1;  // 购买次数，可以通过其他合约指定 adminContract.getNumxxx()
    // }


    // 机构自己授权，  需要支付费用给合约，    合约将费用转给管理员
    function authToUser(address to, string memory organizationName) public payable{

    // 高版本的solidity区分 payable address 和 address，    将地址转为  payable address
    address ad = adminContract.getAdminAddress();
    address(uint160(ad)).transfer(100);   //  合约转钱给管理员

    require(msg.value >= adminContract.payForHealthData());

    uint256 balance = msg.value - adminContract.payForHealthData();
    msg.sender.transfer(balance);

    visitors[to].organizationName = organizationName;
    visitors[to].visitCount += adminContract.gethealthDataCount();  // 购买次数，可以通过其他合约指定
    }

    // 回退函数
    function () external payable{}

}
