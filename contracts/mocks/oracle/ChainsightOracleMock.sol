// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
import '../../interfaces/IChainsightOracle.sol';

contract ChainsightOracleMock is IChainsightOracle {
  function updateState(bytes calldata data) external override {}

  struct Data {
    uint256 value;
    uint256 timestamp;
  }

  mapping(address => Data) public data;

  function updateStateMock(uint256 value, uint256 timestamp) external {
    data[msg.sender] = Data(value, timestamp);
  }

  function readAsString(
    address sender
  ) external view override returns (string memory, uint256 timestamp) {}

  function readAsUint256(
    address sender
  ) external view override returns (uint256, uint256 timestamp) {
    return (data[sender].value, data[sender].timestamp);
  }

  function readAsUint128(
    address sender
  ) external view override returns (uint128, uint256 timestamp) {}

  function readAsUint64(
    address sender
  ) external view override returns (uint64, uint256 timestamp) {}
}
