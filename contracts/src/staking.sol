//SPDX-License-Identifier: MIT
// 0x81E43957898eebaD04c0D5889324A8B46C27029C

pragma solidity ^0.8.19;

contract Staking {
    mapping(address => uint256) public stakes;

    uint256 public AMOUNT = 10 ** 16;

    event UserRegistered(address indexed user);

    function stake() public payable {
        require(msg.value >= AMOUNT, "Amount should be 100 for staking");
        stakes[msg.sender] += AMOUNT;
        emit UserRegistered(msg.sender);
    }
}
