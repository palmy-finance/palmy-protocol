import { task } from 'hardhat/config';
import { eContractid, eNetwork, eOasysNetwork } from '../../helpers/types';
import { deployToOasysTestnet, insertContractAddressInDb } from '../../helpers/contracts-helpers';
import { printContracts } from '../../helpers/misc-utils';
import { getLendingPoolAddressesProvider } from '../../helpers/contracts-getters';

export const DEPLOYMENT_CONTRACTS = [
  eContractid.LendingPoolAddressesProviderRegistry,
  eContractid.LendingPoolAddressesProvider,
  eContractid.LendingPoolImpl,
  eContractid.LendingPoolConfiguratorImpl,
  eContractid.LendingRateOracle,
  eContractid.LToken,
  eContractid.PalmyFallbackOracle,
  eContractid.PalmyOracle,
  eContractid.PalmyProtocolDataProvider,
  eContractid.PriceAggregatorAdapterChainsightImpl,
  eContractid.ChainsightOracle,
  eContractid.StableAndVariableTokensHelper,
  eContractid.StableDebtToken,
  eContractid.VariableDebtToken,
  eContractid.WETHGateway,
  eContractid.LendingPoolCollateralManager,
  eContractid.UiPoolDataProviderV2,
  eContractid.UiIncentiveDataProviderV2,
  eContractid.WalletBalanceProvider,
];

task('oasys-initialization', 'Initialize Palmy oasys enviroment').setAction(async ({}, DRE) => {
  await DRE.run('set-DRE');

  console.log('Initialization started\n');
  const network = DRE.network.name as eNetwork;

  const addressProvider = await getLendingPoolAddressesProvider();
});
