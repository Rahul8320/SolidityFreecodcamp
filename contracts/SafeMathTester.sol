// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract SafeMathTester {
    
    uint8 public num = 255;

    function add(uint8 _val) public {
        num = num + _val;
    }
    
}