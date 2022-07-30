//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract TelusktoToken {
    string private name = "Telusko Token";
    string private symbol = "tusk";
    uint256 private immutable totalSupply;
    address private immutable i_owner;

    mapping(address => uint256) private balanceOf;

    constructor(uint256 _totalToken){
        totalSupply = _totalToken;
        balanceOf[msg.sender] = _totalToken;
        i_owner = msg.sender;
    }

    event Transfer(
        address from,
        address to,
        uint256 value
    );

    function transfer(address _to, uint256 _value) public {
        require(balanceOf[msg.sender] >= _value);
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
    }

    function getBalance(address _address) public view returns(uint256) {
        return balanceOf[_address];
    }

    function tokenName() public view returns(string memory) {
        return name;
    }

    function tokenSymbol() public view returns(string memory) {
        return symbol;
    }

    function totalToken() public view returns(uint256) {
        return totalSupply;
    }

    function owner() public view returns(address) {
        return i_owner;
    }
}