# Ethernaut Delegation solution
## Problem
Given the contract below, claim the ownership of Delegation contract.
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Delegate {

  address public owner;

  constructor(address _owner) {
    owner = _owner;
  }

  function pwn() public {
    owner = msg.sender;
  }
}

contract Delegation {

  address public owner;
  Delegate delegate;

  constructor(address _delegateAddress) {
    delegate = Delegate(_delegateAddress);
    owner = msg.sender;
  }

  fallback() external {
    (bool result,) = address(delegate).delegatecall(msg.data);
    if (result) {
      this;
    }
  }
}
```

## Explaination
So we can see the only way to claim the ownership is through fallback function with delegatecall inside.
So we need to know 2 things
 1. How to call the fallback()?
 2. How delegatecall work?

### Fallback
So the fallback() have been call when the msg.data function selector (first 4 bytes) didn't match any in the contract. So the fallback will be call.
Same thing when we transfer native coin to the contract, but now the fallback must come with ```payable``` to be able receive native.
### Delegatecall
Delegatecall is just a lowlevel function like call. But the different thing is that, when A's contract delegate call to B'contract. B' contract code execute with A'contract storage, msg.sender & msg.value.

## Solution
So when we break all the information we need, the solution is really clearly :
1. We send a transaction with data "0xdd365b8b" (pwn() function selector) to **Delegation** contract.
2. fallback execute and then delegatecall("0xdd365b8b") to **Delegate** contract.
3. With the "0xdd365b8b" the first 4 bytes is "dd365b8b" match with the pwn(), so it will be call.
4. Execute ```owner = msg.sender```, with owner is variable from **Delegation's** storage.
5. Now the **sender** is the **owner** of **Delagation** contract
