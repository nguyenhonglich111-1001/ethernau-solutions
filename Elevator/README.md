# Ethernaut Dex solution
## Problem
The goal of this level is for you to hack the basic DEX contract below and steal the funds by price manipulation.

You will start with 10 tokens of token1 and 10 of token2. The DEX contract starts with 100 of each token.

You will be successful in this level if you manage to drain all of at least 1 of the 2 tokens from the contract, and allow the contract to report a "bad" price of the assets.
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract Dex is Ownable {
  address public token1;
  address public token2;
  constructor() {}

  function setTokens(address _token1, address _token2) public onlyOwner {
    token1 = _token1;
    token2 = _token2;
  }
  
  function addLiquidity(address token_address, uint amount) public onlyOwner {
    IERC20(token_address).transferFrom(msg.sender, address(this), amount);
  }
  
  function swap(address from, address to, uint amount) public {
    require((from == token1 && to == token2) || (from == token2 && to == token1), "Invalid tokens");
    require(IERC20(from).balanceOf(msg.sender) >= amount, "Not enough to swap");
    uint swapAmount = getSwapPrice(from, to, amount);
    IERC20(from).transferFrom(msg.sender, address(this), amount);
    IERC20(to).approve(address(this), swapAmount);
    IERC20(to).transferFrom(address(this), msg.sender, swapAmount);
  }

  function getSwapPrice(address from, address to, uint amount) public view returns(uint){
    return((amount * IERC20(to).balanceOf(address(this)))/IERC20(from).balanceOf(address(this)));
  }

  function approve(address spender, uint amount) public {
    SwappableToken(token1).approve(msg.sender, spender, amount);
    SwappableToken(token2).approve(msg.sender, spender, amount);
  }

  function balanceOf(address token, address account) public view returns (uint){
    return IERC20(token).balanceOf(account);
  }
}

contract SwappableToken is ERC20 {
  address private _dex;
  constructor(address dexInstance, string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        _dex = dexInstance;
  }

  function approve(address owner, address spender, uint256 amount) public {
    require(owner != _dex, "InvalidApprover");
    super._approve(owner, spender, amount);
  }
}
```

## Explaination
+ So the website already have bonus suggest what should care about. 
+ But the thing come very first to me is the line "How is the price of the token calculated?".
+ After read that, I let myfocus to the getSwapPrice() which have price formula base on the ratio of balance between the total balance of from and to.
+ So I make a formula to make sure I right, the price is amount * balanceTo / balanceFrom. In order to drain fully 1 token so the amount (in) must >= amount out.
+ It come to the full formula amount * balanceTo / balanceFrom >= amount or we can say balanceTo >= balanceFrom. 
+ And the larger diff of ratio is, the more amount out we get.

## Solution 
So when we break all the information we need, the solution is really clearly :
1. After approve, We change all balance from token1 -> token2. So balance now 0 - 20. And contract balance is 110 90. Right here we get the ratio diff.
2. Send all the token2 -> token1. Right here we on the way to drain all the token in contract. Cause [20*110/90] = 24, we send 20 but get 24.
3. Replay step 2 until we can't play anymore.
4. Calc a litte bit and send swap the last time to achieve the goal.


### Log
```
10 10
100 100
```
```
Start
10 10
100 100
```
```
20 0
90 110
```
```
24 0
86 110
```
```
30 0
80 110
```
```
41 0
69 110
```
```
65 0
45 110
```

At the end I swap 45 token. 45*110/45 = 110. Exact the amount in the contract have.
The final log is:
```
20 110
90 0
```

