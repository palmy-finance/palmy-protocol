import { task } from 'hardhat/config';
import { eNetwork } from '../../helpers/types';

import { ConfigNames, loadPoolConfig } from '../../helpers/configuration';

task('oasys-initialization:weth-gateway', '').setAction(async ({}, DRE) => {
  await DRE.run('set-DRE');
  // Do nothing
});
