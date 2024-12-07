//SPDX-License-Identifier: MIT
//SPDX-License-Identifier: MIT

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
    // Here I am taking this as the federated Average , in actual we
    // can take some different values
}
