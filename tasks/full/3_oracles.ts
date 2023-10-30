import { task } from 'hardhat/config';
import {
  ConfigNames,
  getGenesisPoolAdmin,
  getLendingRateOracles,
  getQuoteCurrency,
  loadPoolConfig,
} from '../../helpers/configuration';
import {
  deployLendingRateOracle,
  deployPriceAggregatorChainsightImpl,
  deployPalmyFallbackOracle,
  deployPalmyOracle,
} from '../../helpers/contracts-deployments';
import {
  getFirstSigner,
  getLendingPoolAddressesProvider,
  getLendingRateOracle,
  getPriceAggregator,
  getPalmyFallbackOracle,
  getPalmyOracle,
} from '../../helpers/contracts-getters';
import { getParamPerNetwork } from '../../helpers/contracts-helpers';
import { notFalsyOrZeroAddress, waitForTx } from '../../helpers/misc-utils';
import { setInitialMarketRatesInRatesOracleByHelper } from '../../helpers/oracles-helpers';
import { eNetwork, ICommonConfiguration, SymbolMap } from '../../helpers/types';
import { LendingRateOracle, PalmyFallbackOracle, PalmyOracle } from '../../types';
import { PriceAggregatorAdapterChainsightImpl } from './../../types/PriceAggregatorAdapterChainsightImpl.d';

task('full:deploy-oracles', 'Deploy oracles for dev enviroment')
  .addFlag('verify', 'Verify contracts at Etherscan')
  .addParam('pool', `Pool name to retrieve configuration, supported: ${Object.values(ConfigNames)}`)
  .setAction(async ({ verify, pool }, DRE) => {
    try {
      await DRE.run('set-DRE');
      const network = <eNetwork>DRE.network.name;
      const poolConfig = loadPoolConfig(pool);
      const {
        ProtocolGlobalParams: { UsdAddress },
        ReserveAssets,
        FallbackOracle,
        DIAAggregator,
        DIAAggregatorAddress,
        OracleQuoteCurrency,
      } = poolConfig as ICommonConfiguration;
      const lendingRateOracles = getLendingRateOracles(poolConfig);
      const addressesProvider = await getLendingPoolAddressesProvider();
      const admin = await getGenesisPoolAdmin(poolConfig);
      const PalmyOracleAddress = getParamPerNetwork(poolConfig.PalmyOracle, network);
      const priceAggregatorAddress = getParamPerNetwork(poolConfig.PriceAggregator, network);
      const lendingRateOracleAddress = getParamPerNetwork(poolConfig.LendingRateOracle, network);
      const fallbackOracleAddress = getParamPerNetwork(FallbackOracle, network);
      const reserveAssets = getParamPerNetwork(ReserveAssets, network);
      const feedTokens = getParamPerNetwork(DIAAggregator, network);
      const diaAggregatorAddress = getParamPerNetwork(DIAAggregatorAddress, network);
      const tokensToWatch: SymbolMap<string> = {
        ...reserveAssets,
        USD: UsdAddress,
      };

      let priceAggregatorAdapter: PriceAggregatorAdapterChainsightImpl;
      let PalmyOracle: PalmyOracle;
      let lendingRateOracle: LendingRateOracle;
      let fallbackOracle: PalmyFallbackOracle;

      priceAggregatorAdapter = notFalsyOrZeroAddress(priceAggregatorAddress)
        ? await getPriceAggregator(priceAggregatorAddress)
        : await deployPriceAggregatorChainsightImpl([diaAggregatorAddress, OracleQuoteCurrency]);
      await waitForTx(
        await priceAggregatorAdapter.setAssetSources(
          Object.values(feedTokens), // address
          Object.keys(feedTokens) // symbol
        )
      );

      // deploy fallbackOracle
      if (notFalsyOrZeroAddress(fallbackOracleAddress)) {
        fallbackOracle = await getPalmyFallbackOracle(fallbackOracleAddress);
      } else {
        fallbackOracle = await deployPalmyFallbackOracle(verify);
        const currentSignerAddress = (
          await (await getFirstSigner()).getAddress()
        ).toLocaleLowerCase();
        await fallbackOracle.authorizeSybil(currentSignerAddress);
      }

      if (notFalsyOrZeroAddress(PalmyOracleAddress)) {
        PalmyOracle = await getPalmyOracle(PalmyOracleAddress);
        await waitForTx(await PalmyOracle.setPriceAggregator(priceAggregatorAdapter.address));
      } else {
        PalmyOracle = await deployPalmyOracle(
          [
            priceAggregatorAdapter.address,
            fallbackOracle.address,
            await getQuoteCurrency(poolConfig),
            poolConfig.OracleQuoteUnit,
          ],
          verify
        );
      }

      if (notFalsyOrZeroAddress(lendingRateOracleAddress)) {
        lendingRateOracle = await getLendingRateOracle(lendingRateOracleAddress);
      } else {
        lendingRateOracle = await deployLendingRateOracle(verify);
        const { USD, ...tokensAddressesWithoutUsd } = tokensToWatch;
        await setInitialMarketRatesInRatesOracleByHelper(
          lendingRateOracles,
          tokensAddressesWithoutUsd,
          lendingRateOracle,
          admin
        );
      }

      console.log('Palmy Oracle: %s', PalmyOracle.address);
      console.log('Lending Rate Oracle: %s', lendingRateOracle.address);

      // Register the proxy price provider on the addressesProvider
      await waitForTx(await addressesProvider.setPriceOracle(PalmyOracle.address));
      await waitForTx(await addressesProvider.setLendingRateOracle(lendingRateOracle.address));
    } catch (error) {
      if (DRE.network.name.includes('tenderly')) {
        const transactionLink = `https://dashboard.tenderly.co/${DRE.config.tenderly.username}/${
          DRE.config.tenderly.project
        }/fork/${DRE.tenderly.network().getFork()}/simulation/${DRE.tenderly.network().getHead()}`;
        console.error('Check tx error:', transactionLink);
      }
      throw error;
    }
  });
