// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
import '../interfaces/IChainsightOracle.sol';

contract ChainsightOracle is IChainsightOracle {
  mapping(address => bytes) public data;

  function updateState(bytes calldata _data) external override {
    data[msg.sender] = _data;
    emit StateUpdated(msg.sender, _data);
  }

  function readAsString(address sender) external view override returns (string memory) {
    return abi.decode(data[sender], (string));
  }

  function readAsUint256(address sender) external view override returns (uint256) {
    return abi.decode(data[sender], (uint256));
  }

  function readAsUint128(address sender) external view override returns (uint128) {
    return abi.decode(data[sender], (uint128));
  }

  function readAsUint64(address sender) external view override returns (uint64) {
    return abi.decode(data[sender], (uint64));
  }
}
