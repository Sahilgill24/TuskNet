//SPDX-License-Identifier:MIT
// deployed address: 0xeb640878c5f8D9E91A86786dC9c3E30E203EBc17
pragma solidity ^0.8.19;

contract BlobIDstorage {
    mapping(address => string[]) public storageID;

    function getBlobIDs() external view returns (string[] memory) {
        return storageID[msg.sender];
    }

    function uploadBlobIDs(string memory blobID) public {
        storageID[msg.sender].push(blobID);
    }
}
