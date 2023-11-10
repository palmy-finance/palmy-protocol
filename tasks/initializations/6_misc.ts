import { task } from 'hardhat/config';
import { ICommonConfiguration, eNetwork } from '../../helpers/types';

import { ConfigNames, getTreasuryAddress, loadPoolConfig } from '../../helpers/configuration';
import { getParamPerNetwork } from '../../helpers/contracts-helpers';
import { initReservesByHelper } from '../../helpers/init-helpers';

task('oasys-initialization:misc', '').setAction(async ({}, DRE) => {
  await DRE.run('set-DRE');
  const network = DRE.network.name as eNetwork;
  const poolConfig = loadPoolConfig(ConfigNames.Palmy);
  const {
    LTokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    ReserveAssets,
    ReservesConfig,
    LendingPoolCollateralManager,
    WethGateway,
    IncentivesController,
  } = poolConfig as ICommonConfiguration;
  const reserveAssets = await getParamPerNetwork(ReserveAssets, network);
  if (!reserveAssets) {
    throw 'Reserve assets is undefined. Check ReserveAssets configuration at config directory';
  }
  const treasuryAddress = await getTreasuryAddress(poolConfig);
  await initReservesByHelper(
    ReservesConfig,
    reserveAssets,
    LTokenNamePrefix,
    StableDebtTokenNamePrefix,
    VariableDebtTokenNamePrefix,
    SymbolPrefix,
    admin,
    treasuryAddress,
    incentivesController,
    pool,
    verify
  );
});
