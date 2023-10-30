// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import "./LToken.sol";

/**
 * @title Palmy ERC20 LToken Rev2
 * @dev Implementation of the interest bearing token for the Palmy protocol
 * @author Palmy finance
 */
contract LTokenRev2 is LToken {
  uint256 public constant LTOKEN_REVISION_2 = 0x2;

  /**
   * @dev returns the revision number of the contract
   *      for release the revision info to the public
   **/
  function getCurrentRevision() public pure virtual returns (uint256) {
    return getRevision();
  }

  /// @inheritdoc VersionedInitializable
  function getRevision() internal pure virtual override returns (uint256) {
    return LTOKEN_REVISION_2;
  }
}
