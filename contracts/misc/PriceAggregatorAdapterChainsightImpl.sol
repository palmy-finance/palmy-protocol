// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import {IPriceAggregatorAdapter} from '../interfaces/IPriceAggregatorAdapter.sol';
import {PalmyOwnable} from '../dependencies/PalmyOwnable.sol';
import {IChainsightOracle} from '../interfaces/IChainsightOracle.sol';
import {IERC20Detailed} from '../dependencies/openzeppelin/contracts/IERC20Detailed.sol';
import {SafeMath} from '../dependencies/openzeppelin/contracts/SafeMath.sol';

/// @title PriceAggregatorChainsightImpl
/// @author Palmy finance
/// @notice Price aggregator Chainsight implementation
contract PriceAggregatorAdapterChainsightImpl is IPriceAggregatorAdapter, PalmyOwnable {
  using SafeMath for uint256;
  mapping(address => Oracle) public oracles;
  event AssetSourcesUpdated(address[] assets, address[] oracleAddresses, address[] senders);
  uint256 constant PRICE_DATA_FRESHNESS_THRESHOLD = 1 hours;

  struct Oracle {
    IChainsightOracle oracle;
    address sender;
  }

  constructor(address initialOwner) public PalmyOwnable(initialOwner) {}

  /// @notice External function called by the Palmy governance to set or replace sources of assets
  /// @param assets The addresses of the assets
  /// @param oracleAddresses The oracle address of the source of each asset
  /// @param senders The sender address of the source of each asset
  function setAssetSources(
    address[] calldata assets,
    address[] calldata oracleAddresses,
    address[] calldata senders
  ) external onlyOwner {
    _setAssetsSources(assets, oracleAddresses, senders);
    emit AssetSourcesUpdated(assets, oracleAddresses, senders);
  }

  /// @notice Internal function to set the sources for each asset
  /// @param assets The addresses of the assets
  /// @param oracleAddresses The addresses of the source of each asset
  /// @param senders The sender address of the source of each asset
  function _setAssetsSources(
    address[] calldata assets,
    address[] calldata oracleAddresses,
    address[] calldata senders
  ) internal {
    require(assets.length == oracleAddresses.length, 'INCONSISTENT_PARAMS_LENGTH');
    require(assets.length == senders.length, 'INCONSISTENT_PARAMS_LENGTH');
    for (uint256 i = 0; i < assets.length; i++) {
      oracles[assets[i]] = Oracle(IChainsightOracle(oracleAddresses[i]), senders[i]);
    }
  }

  /// @dev Get current price of the asset
  /// @param asset The address of the asset
  /// @return The price of the asset
  function currentPrice(address asset) external view override returns (int256) {
    Oracle memory oracle = oracles[asset];
    if (oracle.oracle == IChainsightOracle(address(0))) {
      return 0;
    }
    (uint256 price, uint256 timestamp) = oracle.oracle.readAsUint256(oracle.sender);
    uint256 currentTime = block.timestamp;
    if (currentTime.sub(timestamp) > PRICE_DATA_FRESHNESS_THRESHOLD) {
      revert('STALE_DATA');
    }
    return int256(price);
  }
}
