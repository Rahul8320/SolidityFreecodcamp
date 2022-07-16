// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract FallBackExample {
    uint public store;

    receive() external payable {
        store = 1;
    }

    fallback() external payable {
        store = 2;
    }
}