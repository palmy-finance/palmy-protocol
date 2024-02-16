// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
import '../interfaces/IChainsightOracle.sol';

contract ChainsightOracle is IChainsightOracle {
  struct Data {
    bytes data;
    uint256 timestamp;
  }
  mapping(address => Data) public data;

  function updateState(bytes calldata _data) external override {
    data[msg.sender] = Data(_data, block.timestamp);
    emit StateUpdated(msg.sender, _data, block.timestamp);
  }

  function readAsString(address sender) external view override returns (string memory, uint256) {
    Data memory d = data[sender];
    if (d.data.length == 0) {
      return ('', 0);
    }
    return (string(d.data), d.timestamp);
  }

  function readAsUint256(address sender) external view override returns (uint256, uint256) {
    bytes memory d = data[sender].data;
    if (d.length == 0) {
      return (0, 0);
    }
    return (abi.decode(d, (uint256)), data[sender].timestamp);
  }

  function readAsUint128(address sender) external view override returns (uint128, uint256) {
    bytes memory d = data[sender].data;
    if (d.length == 0) {
      return (0, 0);
    }
    return (abi.decode(d, (uint128)), data[sender].timestamp);
  }

  function readAsUint64(address sender) external view override returns (uint64, uint256) {
    bytes memory d = data[sender].data;
    if (d.length == 0) {
      return (0, 0);
    }
    return (abi.decode(d, (uint64)), data[sender].timestamp);
  }
}
