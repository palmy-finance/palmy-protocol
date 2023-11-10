import { task } from 'hardhat/config';
import {
  exportDeploymentCallData,
  exportLendingPoolCallData,
} from '../../helpers/contracts-deployments';
import { saveDeploymentCallData } from '../../helpers/contracts-helpers';
import { eContractid } from '../../helpers/types';

task(`export-deploy-calldata-RateStrategies`, '').setAction(async ({}, DRE) => {
  await DRE.run('set-DRE');
});
