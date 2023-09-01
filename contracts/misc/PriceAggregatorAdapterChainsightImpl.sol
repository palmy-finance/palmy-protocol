// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import {IPriceAggregatorAdapter} from '../interfaces/IPriceAggregatorAdapter.sol';
import {Ownable} from '../dependencies/openzeppelin/contracts/Ownable.sol';
import {IChainsightOracle} from '../interfaces/IChainsightOracle.sol';
import {IERC20Detailed} from '../dependencies/openzeppelin/contracts/IERC20Detailed.sol';
import {SafeMath} from '../dependencies/openzeppelin/contracts/SafeMath.sol';

/// @title PriceAggregatorChainsightImpl
/// @author Horizonx.tech
/// @notice Price aggregator Chainsight implementation
contract PriceAggregatorAdapterChainsightImpl is IPriceAggregatorAdapter, Ownable {
  using SafeMath for uint256;
  mapping(address => Oracle) public oracles;
  event AssetSourcesUpdated(address[] assets, address[] oracleAddresses, address[] senders);

  struct Oracle {
    IChainsightOracle oracle;
    address sender;
  }

  /// @notice External function called by the Oasyslend governance to set or replace sources of assets
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
    (int256 price, int256 ts) = oracle.oracle.getValue(oracle.sender);
    return price;
  }
}
