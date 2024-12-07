//SPDX-License-Identifier: MIT
// 0x02994c5bB4F658dDFd3C089edc4C87156105AfD2
pragma solidity ^0.8.19;

contract Staking {
    mapping(address => uint256) public stakes;

    uint256 public AMOUNT = 100;

    event UserRegistered(address user);

    function stake() public payable {
        require(msg.value == AMOUNT, "Amount should be 100 for staking");
        stakes[msg.sender] += AMOUNT;
        emit UserRegistered(msg.sender);
    }
}
