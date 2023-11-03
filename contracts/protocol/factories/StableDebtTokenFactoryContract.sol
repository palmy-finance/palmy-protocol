// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {Ownable} from '../../dependencies/openzeppelin/contracts/Ownable.sol';
import {InitializableAdminUpgradeabilityProxy} from '../../dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol';
import {IERC20} from '../../interfaces/IERC20.sol';
import {ILendingPool} from '../../interfaces/ILendingPool.sol';
import {IPalmyIncentivesController} from '../../interfaces/IPalmyIncentivesController.sol';
import {StableDebtToken} from '../tokenization/StableDebtToken.sol';

/**
 * @title StableDebtToken Factory contract
 * @author Palmy finance
 **/
contract StableDebtTokenFactoryContract {

  struct StableDebtTokenInitializationParams {
    ILendingPool pool;
    address underlyingAsset;
    IPalmyIncentivesController incentivesController;
    uint8 debtTokenDecimals;
    string debtTokenName;
    string debtTokenSymbol;
    bytes params;
  }

  /**
   * @dev Creates a new StableDebtToken as upgradeable proxy
   * @param debtTokenImpl The address of StableDebtToken implementation
   * @param admin The address of the admin of the new StableDebtToken
   * @param params The parameters to be passed to the StableDebtToken contract
   */
  function create(
    StableDebtToken debtTokenImpl,
    address admin,
    StableDebtTokenInitializationParams calldata params
  ) external returns (address) {
    InitializableAdminUpgradeabilityProxy proxy = new InitializableAdminUpgradeabilityProxy();
    proxy.initialize(
      address(debtTokenImpl),
      admin,
      abi.encodeWithSignature(
        'initialize(address,address,address,uint8,string,string,bytes)',
        params.pool,
        params.underlyingAsset,
        params.incentivesController,
        params.debtTokenDecimals,
        params.debtTokenName,
        params.debtTokenSymbol,
        params.params
      )
    );
    return address(proxy);
  }
}
