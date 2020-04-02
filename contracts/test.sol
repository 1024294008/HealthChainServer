

pragma solidity >=0.4.21 <0.7.0;


contract Org_UserList{

  // 机构和用户的映射
  mapping(address => address[]) userList;

  // 管理员地址
  address adminAddr;

  constructor() public{
    adminAddr = msg.sender;
  }

  // 查看管理员地址
  function getAdminAddr() public view returns(address){
    return adminAddr;
  }

  // 修改管理员
  function setAdminAddr(address _addr) public {

    assert(msg.sender == adminAddr);
    adminAddr = _addr;
  }

  // 获取机构对应的用户列表
  function getUserList(address orgAddr) public view returns(address[] memory) {

    assert(msg.sender == adminAddr);
    return userList[orgAddr];
  }

  // 为机构添加用户
  function addUser(address orgAddr, address userAddr) public {

    assert(msg.sender == adminAddr);
    userList[orgAddr].push(userAddr);
  }


}
