// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {LToken} from '../../protocol/tokenization/LToken.sol';
import {ILendingPool} from '../../interfaces/ILendingPool.sol';
import {IOasyslendIncentivesController} from '../../interfaces/IOasyslendIncentivesController.sol';

contract MockLToken is LToken {
  function getRevision() internal pure override returns (uint256) {
    return 0x2;
  }
}
