// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {PalmyOwnable} from '../dependencies/PalmyOwnable.sol';
import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {IPriceAggregatorAdapter} from '../interfaces/IPriceAggregatorAdapter.sol';

import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';
import {SafeERC20} from '../dependencies/openzeppelin/contracts/SafeERC20.sol';
import {Initializable} from '../dependencies/openzeppelin/upgradeability/Initializable.sol';

/// @title PalmyOracle
/// @author Palmy finance
/// @notice Proxy smart contract to get the price of an asset from a price source, with DIA Aggregator
///         smart contracts as primary option
/// - If the returned price by a DIA aggregator is <= 0, the call is forwarded to a fallbackOracle
contract PalmyOracle is IPriceOracleGetter, PalmyOwnable, Initializable {
  using SafeERC20 for IERC20;

  event BaseCurrencySet(address indexed baseCurrency, uint256 baseCurrencyUnit);
  event AssetSourceUpdated(address indexed priceAggregator);
  event FallbackOracleUpdated(address indexed fallbackOracle);

  IPriceOracleGetter private _fallbackOracle;
  IPriceAggregatorAdapter private _adapter;
  address public immutable BASE_CURRENCY;
  uint256 public immutable BASE_CURRENCY_UNIT;

  /// @notice Constructor
  /// @param baseCurrency the base currency used for the price quotes. If USD is used, base currency is 0x0
  /// @param baseCurrencyUnit the unit of the base currency
  constructor(
    address baseCurrency,
    uint256 baseCurrencyUnit,
    address initialOwner
  ) public PalmyOwnable(initialOwner) {
    BASE_CURRENCY = baseCurrency;
    BASE_CURRENCY_UNIT = baseCurrencyUnit;
    emit BaseCurrencySet(baseCurrency, baseCurrencyUnit);
  }

  function initialize(address priceAggregatorAdapter, address fallbackOracle) external initializer {
    _setFallbackOracle(fallbackOracle);
    _setPriceAggregatorAdapter(priceAggregatorAdapter);
  }

  function setPriceAggregator(address priceAggregator) external onlyOwner {
    _setPriceAggregatorAdapter(priceAggregator);
  }

  /// @notice Sets the fallbackOracle
  /// - Callable only by the Palmy governance
  /// @param fallbackOracle The address of the fallbackOracle
  function setFallbackOracle(address fallbackOracle) external onlyOwner {
    _setFallbackOracle(fallbackOracle);
  }

  /// @notice Internal function to set the fallbackOracle
  /// @param fallbackOracle The address of the fallbackOracle
  function _setFallbackOracle(address fallbackOracle) internal {
    _fallbackOracle = IPriceOracleGetter(fallbackOracle);
    emit FallbackOracleUpdated(fallbackOracle);
  }

  function _setPriceAggregatorAdapter(address priceAggregatorAdapter) internal {
    _adapter = IPriceAggregatorAdapter(priceAggregatorAdapter);
    emit AssetSourceUpdated(priceAggregatorAdapter);
  }

  /// @notice Gets an asset price by address
  /// @param asset The asset address
  function getAssetPrice(address asset) public view override returns (uint256) {
    if (asset == BASE_CURRENCY) {
      return BASE_CURRENCY_UNIT;
    }
    int256 price = _adapter.currentPrice(asset);
    if (price > 0) {
      return uint256(price);
    }
    uint256 fallbackPrice = _fallbackOracle.getAssetPrice(asset);
    if (fallbackPrice > 0) {
      return fallbackPrice;
    }

    revert('PalmyOracle: price not available');
  }

  /// @notice Gets a list of prices from a list of assets addresses
  /// @param assets The list of assets addresses
  function getAssetsPrices(address[] calldata assets) external view returns (uint256[] memory) {
    uint256[] memory prices = new uint256[](assets.length);
    for (uint256 i = 0; i < assets.length; i++) {
      prices[i] = getAssetPrice(assets[i]);
    }
    return prices;
  }

  /// @notice Gets the address of the fallback oracle
  /// @return address The addres of the fallback oracle
  function getFallbackOracle() external view returns (address) {
    return address(_fallbackOracle);
  }
}
