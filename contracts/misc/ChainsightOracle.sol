// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

contract ChainsightOracle {
  mapping(address => Price) public prices;
  struct Price {
    uint128 price;
    uint128 timestamp;
  }

  function updateState(uint128 price) external {
    prices[msg.sender] = Price(price, uint128(block.timestamp));
  }

  function getValue(address sender) external view returns (uint256, uint256) {
    Price memory price = prices[sender];
    return (price.price, price.timestamp);
  }
}
