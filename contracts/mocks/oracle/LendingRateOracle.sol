// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {ILendingRateOracle} from '../../interfaces/ILendingRateOracle.sol';
import {PalmyOwnable} from '../../dependencies/PalmyOwnable.sol';

contract LendingRateOracle is ILendingRateOracle, PalmyOwnable {
  mapping(address => uint256) borrowRates;
  mapping(address => uint256) liquidityRates;

  constructor(address initialOwner) public PalmyOwnable(initialOwner) {}

  function getMarketBorrowRate(address _asset) external view override returns (uint256) {
    return borrowRates[_asset];
  }

  function setMarketBorrowRate(address _asset, uint256 _rate) external override onlyOwner {
    borrowRates[_asset] = _rate;
  }

  function getMarketLiquidityRate(address _asset) external view returns (uint256) {
    return liquidityRates[_asset];
  }

  function setMarketLiquidityRate(address _asset, uint256 _rate) external onlyOwner {
    liquidityRates[_asset] = _rate;
  }
}
