// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

/************
@title IChainsightOracle interface
@notice Interface for the Chainsight price oracle.*/
interface IChainsightOracle {
  /**
   * @dev returns the asset price
   * @return the price of the asset
   **/
  function getValue(address sender) external view returns (uint128, uint128);
}
