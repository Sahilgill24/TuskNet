//SPDX-License-Identifier: MIT
// 0x23cacbF723355F96fb42ce3ba1Cbc247F41C2568

pragma solidity ^0.8.19;

contract Aggregator {
    uint256[] private decryptedValues;
    mapping(address => uint256) private Addrestovalue;

    function decryptedValue(uint256 val) public {
        decryptedValues.push(val);
    }

    function federatedaverage() public view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < decryptedValues.length; i++) {
            sum += decryptedValues[i];
        }
        return sum / decryptedValues.length;
    }
    // Here I am taking this as the federated Average
    // ** actual math **
}
