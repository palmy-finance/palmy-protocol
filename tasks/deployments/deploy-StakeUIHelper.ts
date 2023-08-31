import { notFalsyOrZeroAddress } from './../../helpers/misc-utils';
import { task } from 'hardhat/config';
import { deployStakeUIHelper } from '../../helpers/contracts-deployments';
import { eContractid, eNetwork, ICommonConfiguration } from '../../helpers/types';
import { getOasyslendOracle } from '../../helpers/contracts-getters';
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
      StakedOal,
      ProtocolGlobalParams: { UsdAddress },
    } = poolConfig as ICommonConfiguration;
    const oracle = await getOasyslendOracle();
    const assets = getParamPerNetwork(ReserveAssets, network);
    const oal = assets['OAL'];
    const stkOal = getParamPerNetwork(StakedOal, network);
    console.log(`\n- StakeUIHelper oracle: ${oracle.address}`);
    console.log(`\n- StakeUIHelper oal: ${oal}`);
    console.log(`\n- StakeUIHelper stkOal: ${stkOal}`);
    console.log(`\n- StakeUIHelper usd: ${UsdAddress}`);
    console.log(`\n- StakeUIHelper deployment`);

    if (!notFalsyOrZeroAddress(oracle.address)) {
      throw new Error('oracle address is not defined');
    }
    if (!notFalsyOrZeroAddress(oal)) {
      throw new Error('oal address is not defined');
    }
    if (!notFalsyOrZeroAddress(stkOal)) {
      throw new Error('stkOal address is not defined');
    }
    if (!notFalsyOrZeroAddress(UsdAddress)) {
      throw new Error('UsdAddress address is not defined');
    }

    const StakeUIHelper = await deployStakeUIHelper([oracle.address, oal, stkOal, UsdAddress]);

    console.log('StakeUIHelper deployed :', StakeUIHelper.address);
    console.log(`\tFinished StakeUIHelper deployment`);
  });
