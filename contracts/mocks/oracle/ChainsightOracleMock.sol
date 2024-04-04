// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
import '../../interfaces/IChainsightOracle.sol';
pragma experimental ABIEncoderV2;

contract ChainsightOracleMock is IChainsightOracle {
  struct Data {
    uint256 value;
    uint256 timestamp;
  }
  mapping(address => Data) public data;

  function updateState(bytes calldata _data) external override {}

  function updateStateByKey(bytes calldata _data, bytes32 key) external override {}

  function updateStateBulk(bytes[] calldata _data, bytes32[] calldata keys) external override {}

  function readAsUint256WithTimestamp(
    address sender,
    bytes32 _key
  ) external view override returns (uint256, uint64) {
    return (data[sender].value, uint64(data[sender].timestamp));
  }

  function updateStateMock(uint256 value, uint256 timestamp) external {
    data[msg.sender] = Data(value, timestamp);
  }
}
