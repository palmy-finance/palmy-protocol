import { notFalsyOrZeroAddress } from './../../helpers/misc-utils';
import { task } from 'hardhat/config';
import { deployStakeUIHelper } from '../../helpers/contracts-deployments';
import { eContractid, eNetwork, ICommonConfiguration } from '../../helpers/types';
import { getPalmyOracle } from '../../helpers/contracts-getters';
import { getParamPerNetwork } from '../../helpers/contracts-helpers';
import { ConfigNames, loadPoolConfig } from '../../helpers/configuration';

task(`deploy-${eContractid.StakeUIHelper}`, `Deploys the StakeUIHelper contract`)
  .addFlag('verify', 'Verify StakeUIHelper contract via Etherscan API.')
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ verify, pool }, localBRE) => {
    await localBRE.run('set-DRE');
    if (!localBRE.network.config.chainId) {
      throw new Error('INVALID_CHAIN_ID');
    }
    const network = <eNetwork>localBRE.network.name;
    const poolConfig = loadPoolConfig(pool);
    const {
      ReserveAssets,
      StakedOas: StakedOas,
      ProtocolGlobalParams: { UsdAddress },
    } = poolConfig as ICommonConfiguration;
    const oracle = await getPalmyOracle();
    const assets = getParamPerNetwork(ReserveAssets, network);
    const woas = assets['WOAL'];
    const stkOal = getParamPerNetwork(StakedOas, network);
    console.log(`\n- StakeUIHelper oracle: ${oracle.address}`);
    console.log(`\n- StakeUIHelper woas: ${woas}`);
    console.log(`\n- StakeUIHelper stkOas: ${stkOal}`);
    console.log(`\n- StakeUIHelper usd: ${UsdAddress}`);
    console.log(`\n- StakeUIHelper deployment`);

    if (!notFalsyOrZeroAddress(oracle.address)) {
      throw new Error('oracle address is not defined');
    }
    if (!notFalsyOrZeroAddress(woas)) {
      throw new Error('woas address is not defined');
    }
    if (!notFalsyOrZeroAddress(stkOal)) {
      throw new Error('stkOas address is not defined');
    }
    if (!notFalsyOrZeroAddress(UsdAddress)) {
      throw new Error('UsdAddress address is not defined');
    }

    const StakeUIHelper = await deployStakeUIHelper([oracle.address, woas, stkOal, UsdAddress]);

    console.log('StakeUIHelper deployed :', StakeUIHelper.address);
    console.log(`\tFinished StakeUIHelper deployment`);
  });
