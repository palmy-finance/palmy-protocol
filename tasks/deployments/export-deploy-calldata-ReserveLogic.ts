import { task } from 'hardhat/config';
import { exportDeploymentCallData } from '../../helpers/contracts-deployments';
import { getOasysDeploymentAddress, saveDeploymentCallData } from '../../helpers/contracts-helpers';
import { eContractid, eNetwork } from '../../helpers/types';
import { Address } from 'ethereumjs-util';
import { hexValue } from 'ethers/lib/utils';

const target = eContractid.ReserveLogic;

task(`export-deploy-calldata-${target}`, '').setAction(async ({}, DRE) => {
  await DRE.run('set-DRE');
  const callData = await exportDeploymentCallData(target);
  const address = await getOasysDeploymentAddress(callData);
  console.log(`OASYS ${target} address: ${address}`);
  await saveDeploymentCallData(target, callData);
});
