// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

/************
@title IChainsightOracle interface
@notice Interface for the Chainsight price oracle.*/
interface IChainsightOracle {
  struct Value {
    bytes data;
    uint64 timestamp;
  }

  event StateUpdated(address indexed sender, bytes data, bytes32 indexed key);

  function updateState(bytes calldata data) external;

  function updateStateByKey(bytes calldata data, bytes32 key) external;

  function updateStateBulk(bytes[] calldata data, bytes32[] calldata keys) external;

  function readAsUint256WithTimestamp(
    address sender,
    bytes32 key
  ) external view returns (uint256, uint64);
}
