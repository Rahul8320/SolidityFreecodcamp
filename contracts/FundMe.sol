// SPDX-License-Identifier:MIT

pragma solidity ^0.8.7;

import "./PriceConverter.sol";

contract FundMe {

    using PriceConverter for uint256;

    uint256 public constant minimumUSD = 50 * 10 ** 18;

    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function fund() public payable{
        require(msg.value.getConversionRate() >= minimumUSD, "You have to send more money!");
        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for(uint256 index=0;index < funders.length; index = index + 1) {
            addressToAmountFunded[funders[index]] = 0;
        }
        // reset the array
        funders = new address[](0);
        // withdraw the amount from this contract
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed!");
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this!");
        _;
    }
}

//5:5:42