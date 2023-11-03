// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {Ownable} from '../../dependencies/openzeppelin/contracts/Ownable.sol';
import {InitializableAdminUpgradeabilityProxy} from '../../dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol';
import {IERC20} from '../../interfaces/IERC20.sol';
import {ILendingPool} from '../../interfaces/ILendingPool.sol';
import {IPalmyIncentivesController} from '../../interfaces/IPalmyIncentivesController.sol';
import {LToken} from '../tokenization/LToken.sol';

/**
 * @title LToken Factory contract
 * @author Palmy finance
 **/
contract LTokenFactoryContract {

  struct LTokenInitializationParams {
    ILendingPool pool;
    address treasury;
    address underlyingAsset;
    IPalmyIncentivesController incentivesController;
    uint8 lTokenDecimals;
    string lTokenName;
    string lTokenSymbol;
    bytes params;
  }

  /**
   * @dev Creates a new LToken as upgradeable proxy
   * @param lTokenImpl The address of LToken implementation
   * @param admin The address of the admin of the new LToken
   * @param params The parameters to be passed to the LToken contract
   */
  function create(
    LToken lTokenImpl,
    address admin,
    LTokenInitializationParams calldata params
  ) external returns (address) {
    InitializableAdminUpgradeabilityProxy proxy = new InitializableAdminUpgradeabilityProxy();
    proxy.initialize(
      address(lTokenImpl),
      admin,
      abi.encodeWithSignature(
        'initialize(address,address,address,address,uint8,string,string,bytes)',
        params.pool,
        params.treasury,
        params.underlyingAsset,
        params.incentivesController,
        params.lTokenDecimals,
        params.lTokenName,
        params.lTokenSymbol,
        params.params
      )
    );
    return address(proxy);
  }
}
