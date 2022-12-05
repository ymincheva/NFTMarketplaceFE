// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import 'hardhat/console.sol';

contract Wallet {
  address payable public owner;

  mapping(address => uint256) public userBalance;

  constructor() {
    owner = payable(msg.sender);
  }

  function deposit() public payable {
    userBalance[msg.sender] += msg.value;
  }
}
