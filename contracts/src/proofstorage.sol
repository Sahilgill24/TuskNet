//SPDX-License-Identifier:MIT
// address 0x7d5F3135FCd28916b13829023d45d1f948FaC87f

pragma solidity ^0.8.19;

contract Proofstorage {
    mapping(address => string[]) public storageID;

    function getBlobIDs() external view returns (string[] memory) {
        return storageID[msg.sender];
    }

    function uploadBlobIDs(string memory blobID) public {
        storageID[msg.sender].push(blobID);
    }
}
