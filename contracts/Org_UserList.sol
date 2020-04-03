pragma solidity >=0.4.21 <0.7.0;

// 声明其他合约的接口  -- 授权合约
interface AdminContract{
    function getAdminAddress()  external view returns(address);
}

contract Org_UserList{

  // 机构和用户的映射
  mapping(address => address[]) userList;

  // 其他合约地址
  address adminContractAddr;

  // 其他合约实例
  AdminContract adminContract;

  // 构造函数 -- 指定调用合约的地址
  constructor(address _adminContractAddr) public{
    adminContractAddr = _adminContractAddr;
    adminContract = AdminContract(adminContractAddr);   // 通过地址拿到合约实例   --  将地址强制转换为合约
  }

  // 获取机构对应的用户列表
  function getUserList(address orgAddr) public view returns(address[] memory) {

    return userList[orgAddr];
  }

  // 为机构添加用户
  function addUser(address orgAddr, address userAddr) public {

    assert(msg.sender == adminContract.getAdminAddress());
    userList[orgAddr].push(userAddr);
  }

}
