// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

/**
 * @title IPalmyOracle interface
 * @notice Interface for the Palmy oracle.
 **/

interface IPalmyOracle {
  function BASE_CURRENCY() external view returns (address);

  function BASE_CURRENCY_UNIT() external view returns (uint256);

  function getAssetPrice(address asset) external view returns (uint256);
}
