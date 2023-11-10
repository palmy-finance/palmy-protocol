import { task } from 'hardhat/config';
import { exportDeploymentCallData } from '../../helpers/contracts-deployments';
import { saveDeploymentCallData } from '../../helpers/contracts-helpers';
import { eContractid, eNetwork } from '../../helpers/types';
task(`export-deploy-calldata-Oracles`, '').setAction(async ({}, DRE) => {
  await DRE.run('set-DRE');
  const network = (<eNetwork>DRE.network.name) as eNetwork;
  const lendingRateOracle = await exportDeploymentCallData(eContractid.LendingRateOracle);
  await saveDeploymentCallData(eContractid.LendingRateOracle, lendingRateOracle);
  const priceAggregator = await exportDeploymentCallData(
    eContractid.PriceAggregatorAdapterChainsightImpl
  );
  await saveDeploymentCallData(eContractid.PriceAggregatorAdapterChainsightImpl, priceAggregator);
  const fallbackOracle = await exportDeploymentCallData(eContractid.PalmyFallbackOracle);
  await saveDeploymentCallData(eContractid.PalmyFallbackOracle, fallbackOracle);
  const palmyOracle = await exportDeploymentCallData(eContractid.PalmyOracle);
  await saveDeploymentCallData(eContractid.PalmyOracle, palmyOracle);
  const chainsightOracle = await exportDeploymentCallData(eContractid.ChainsightOracle);
  await saveDeploymentCallData(eContractid.ChainsightOracle, chainsightOracle);
});
