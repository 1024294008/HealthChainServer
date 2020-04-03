pragma solidity >=0.4.21 <0.7.0;

// 声明其他合约的接口  -- 授权合约
interface AdminContract{
    function getAdminAddress()  external view returns(address);
    function gethealthDataCount() external view returns(uint32);
}

contract Health{
    // 上链的数据结构
    struct H_Data{   // 需要可以增加时间点
        uint32      heartbeat;    // 心跳
        uint32      stepnumber;   // 步数
        uint32      temperature;  // 体温
    }

    struct User_Info{
        address    owner;         // 数据拥有者
        string     name;          // 身份证编号
        string     birth;         // 出生日期
        uint32     visitCount;    // 总访问次数
    }

    struct Visitor{
        string    name;          // 数据访问者
        uint32    visitCount;    // 数据访问者访问次数
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
    constructor(string memory name, string memory birth, address _adminContractAddr) public{
        // 初始化拥有者信息
        user.name = name;
        user.birth = birth;
        user.owner = msg.sender;
        adminContractAddr = _adminContractAddr;
        adminContract = AdminContract(adminContractAddr);   // 通过地址拿到合约实例   --  将地址强制转换为合约
    }

    // 查询用户信息
    function getUserInfo() public view returns (string memory name, string memory birth){
        // 可以考虑授权限制
        name = user.name;
        birth = user.birth;
    }

    // 更新链上数据
    function addData(uint32 heartbeat, uint32 stepnumber, uint32 temperature) public {
        // 可以考虑授权限制
        // 创建一个数据记录
        H_Data memory item = H_Data(
            {
                heartbeat: heartbeat,
                stepnumber: stepnumber,
                temperature: temperature});
        h_data.push(item);
    }

    // 用户访问健康数据
    function getHData(uint idx) public view returns (uint32 heartbeat, uint32 stepnumber, uint32 temperature) {
        // 权限控制
        require(visitors[msg.sender].visitCount > 0 || msg.sender == user.owner, "没有访问权限");
        // 增加计数
        // 自己实现了 ----------------
        // 返回数据
        if(idx < h_data.length){
            heartbeat = h_data[idx].heartbeat;
            stepnumber = h_data[idx].stepnumber;
            temperature = h_data[idx].temperature;
        }
        else{
            heartbeat = 0;
            stepnumber = 0;
            temperature = 0;
        }
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
    function authToUser(address to, string memory name) public payable{

    // 高版本的solidity区分 payable address 和 address，    将地址转为  payable address
    address ad = adminContract.getAdminAddress();
    address(uint160(ad)).transfer(100);   //  合约转钱给管理员

    visitors[to].name = name;
    visitors[to].visitCount += adminContract.gethealthDataCount();  // 购买次数，可以通过其他合约指定 adminContract.getNumxxx()
    }

    // 回退函数
    receive () external payable{}

}
