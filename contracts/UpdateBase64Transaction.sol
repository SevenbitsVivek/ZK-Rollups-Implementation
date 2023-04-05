
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract UpdateBase64Transaction {
    string Base64;

    constructor() {}

    event SetBase64(address _user, string _base64);

    function setBase64(string memory _newBase64) public {
        Base64 = _newBase64;
        emit SetBase64(msg.sender, _newBase64);
    }

    function getBase64() public view returns (string memory) {
        return Base64;
    }
}