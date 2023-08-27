import { task } from 'hardhat/config';
import { getOasyslendProtocolDataProvider } from '../../helpers/contracts-getters';

task('print-config:fork', 'Deploy development enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .setAction(async ({ verify }, DRE) => {
    await DRE.run('set-DRE');
    await DRE.run('oasyslend:oasys');

    const dataProvider = await getOasyslendProtocolDataProvider();
    await DRE.run('print-config', { dataProvider: dataProvider.address, pool: 'Oasyslend' });
  });
