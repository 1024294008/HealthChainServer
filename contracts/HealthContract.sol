pragma solidity >=0.4.21 <0.7.0;

// 声明其他合约的接口  -- 授权合约
interface AdminContract{
    function getAdminAddress()  external view returns(address);
    function getPayforHealthData() external view returns(uint);
    function getValidSection() external view returns(uint);
    function getAward() external view returns(uint);
    function getUploadSection() external view returns(uint);
}

contract HealthContract{
    // 上链的数据结构
    struct H_Data{
        string      heartRate;    // 心跳
        string		heat;		  // 消耗热量
        string		sleepQuality; // 睡眠质量
        string      distance;     // 步数
        string		evaluation;   // 评论
        string		uploadTime;	  // 上传时间
        uint8       permitVisit;  // 是否公开
    }

    struct User_Info{
        address    owner;         // 数据拥有者
        uint32     visitCount;    // 总访问次数
        uint       lastUploadTime;// 最近一次上传时间
    }

    struct Visitor{
        string    organizationName; // 数据访问者名
        uint      validDate;        // 授权有效时间
    }

    // 拥有者信息
    User_Info          user;

    // 上链数据
    H_Data[]           h_data;

    // 授权用户
    mapping(address => Visitor) public visitors;

    // 管理员合约实例
    AdminContract adminContract;

    // 构造器：初始化时需要拥有者信息
    constructor(address _owner, address _adminContractAddr) public{
        // 初始化拥有者信息
        user.owner = _owner;
        user.visitCount = 0;
        user.lastUploadTime = 0;
        adminContract = AdminContract(_adminContractAddr);   // 通过地址拿到合约实例   --  将地址强制转换为合约
    }

    // 查询用户信息
    function getUserInfo(address caller) public view returns (address  owner, uint32 visitCount, uint lastUploadTime){
        require(caller == user.owner,"没有权限");
        owner = user.owner;
        visitCount = user.visitCount;
        lastUploadTime = user.lastUploadTime;
        return (owner, visitCount, lastUploadTime);
    }

    // 添加链上数据
    function addData(string memory heartRate,string memory heat,string memory sleepQuality,
        string memory distance,string memory evaluation,string memory uploadTime,uint8 permitVisit) public payable{
        require(msg.sender == user.owner,"没有权限");
        require(user.lastUploadTime == 0 || ((block.timestamp - user.lastUploadTime) > adminContract.getUploadSection()), "上传太频繁"); //控制上传频率
        // 创建一个数据记录
        H_Data memory item = H_Data(
            {
                heartRate: heartRate,
				heat: heat,
				sleepQuality: sleepQuality,
				distance: distance,
				evaluation: evaluation,
				uploadTime: uploadTime,
                permitVisit: permitVisit
            });
        h_data.push(item);

        user.lastUploadTime = block.timestamp;      // 更新最近一次上传时间

        // 奖励机制(用户选择公开此条数据会获得更多的以太币奖励)
        if(permitVisit == 1){
            msg.sender.transfer(adminContract.getAward());
        } else {
            msg.sender.transfer(adminContract.getAward() / 2);
        }
    }

    // 获取全部健康数据条数(公开数据+隐私数据)
    function getHealthCount() public view returns(uint len){
        len = h_data.length;
        return len;
    }

    // 获取公开的健康数据条数
    function getPublicHealthCount() public view returns(uint len){
        len = 0;
        for(uint i = 0; i < h_data.length; i++){
            if(h_data[i].permitVisit == 1){
                len += 1;
            }
        }
        return len;
    }

    // 授权给机构(机构通过支付以太币来获取对数据访问的有效时间)
    function authToOrg(string memory organizationName) public payable{
        uint payforHealthData = adminContract.getPayforHealthData();
        require(msg.value >= payforHealthData, "费用不足");

        msg.sender.transfer(msg.value - payforHealthData);                       //  回退多余的以太币
        address(uint160(user.owner)).transfer(payforHealthData);                 //  将授权的以太币转给用户

        visitors[msg.sender].organizationName = organizationName;
        visitors[msg.sender].validDate = block.timestamp;
        user.visitCount += 1;
    }

    // 获取授权信息(剩余的时间)
    function getAuthInfo(address organization) public view returns(uint){
        uint validSection = adminContract.getValidSection();
        uint time = block.timestamp - visitors[organization].validDate;
        if(time < validSection){
            return validSection - time;
        } else {
            return 0;
        }
    }

    // 访问健康数据,用户可以访问自己的全部数据，机构只能在有权限的情况下访问用户的公开数据(不能访问隐私数据)
    function getHDataByIndex(address caller, uint idx) public view returns (string memory heartRate,
        string memory heat,string memory sleepQuality,string memory distance,string memory evaluation,string memory uploadTime,uint8 permitVisit) {
    	// 判断下标
        require(idx < h_data.length, "此条健康数据不存在");
        // 权限控制
        require(caller == user.owner || getAuthInfo(caller) > 0, "没有访问权限");
        // 如果是机构用户，则不允许访问隐私数据
        if(h_data[idx].permitVisit == 0 && caller != user.owner){
            return ("", "", "", "", "", "", 0);
        }
        return (h_data[idx].heartRate, h_data[idx].heat,h_data[idx].sleepQuality,h_data[idx].distance,h_data[idx].evaluation,
            h_data[idx].uploadTime,h_data[idx].permitVisit);
    }

    function()external payable{
    }
}
