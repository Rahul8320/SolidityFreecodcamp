// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

import "./SimpleStorage.sol";

// inheritence : from another contract
contract ExtraStorage is SimpleStorage{
    // function override
    function store(uint _favNum) public override {
        favNum = _favNum + 5;
    }
}