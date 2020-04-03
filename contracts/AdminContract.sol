pragma solidity >=0.4.21 <0.7.0;

contract AdminContract{
    address adminAddress;   // 具备管理权限的地址
    uint32 healthDataCount;  // 单次授权获取的健康数据条数

    constructor() public{
        adminAddress = msg.sender;
        healthDataCount = 20;
    }

    function getAdminAddress() public view returns(address){
        return adminAddress;
    }

    function setAdminAddress(address newAddr) public{
        assert(msg.sender == adminAddress);
        adminAddress = newAddr;
    }

    function gethealthDataCount() public view returns(uint){
        return healthDataCount;
    }

    function sethealthDataCount(uint32 newCount) public{
        assert(msg.sender == adminAddress);
        healthDataCount = newCount;
    }
}
