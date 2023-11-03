// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {Ownable} from '../../dependencies/openzeppelin/contracts/Ownable.sol';
import {InitializableAdminUpgradeabilityProxy} from '../../dependencies/openzeppelin/upgradeability/InitializableAdminUpgradeabilityProxy.sol';
import {IERC20} from '../../interfaces/IERC20.sol';
import {ILendingPool} from '../../interfaces/ILendingPool.sol';
import {IPalmyIncentivesController} from '../../interfaces/IPalmyIncentivesController.sol';
import {VariableDebtToken} from '../tokenization/VariableDebtToken.sol';

/**
 * @title VariableDebtToken Factory contract
 * @author Palmy finance
 **/
contract VariableDebtTokenFactoryContract {

  struct VariableDebtTokenInitializationParams {
    ILendingPool pool;
    address underlyingAsset;
    IPalmyIncentivesController incentivesController;
    uint8 debtTokenDecimals;
    string debtTokenName;
    string debtTokenSymbol;
    bytes params;
  }

  /**
   * @dev Creates a new VariableDebtToken as upgradeable proxy
   * @param debtTokenImpl The address of VariableDebtToken implementation
   * @param admin The address of the admin of the new VariableDebtToken
   * @param params The parameters to be passed to the VariableDebtToken contract
   */
  function create(
    VariableDebtToken debtTokenImpl,
    address admin,
    VariableDebtTokenInitializationParams calldata params
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
