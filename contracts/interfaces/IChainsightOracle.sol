// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

/************
@title IChainsightOracle interface
@notice Interface for the Chainsight price oracle.*/
interface IChainsightOracle {
  function updateState(bytes calldata data) external;

  event StateUpdated(address sender, bytes data);

  function readAsString(address sender) external view returns (string memory);

  function readAsUint256(address sender) external view returns (uint256);

  function readAsUint128(address sender) external view returns (uint128);

  function readAsUint64(address sender) external view returns (uint64);
}