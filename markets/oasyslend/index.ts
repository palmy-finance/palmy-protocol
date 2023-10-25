import {
  eOasysNetwork,
  eEthereumNetwork,
  IOasyslendConfiguration as IOasyslendConfiguration,
} from '../../helpers/types';
import { CommonsConfig } from './commons';
import {
  strategyWOAS,
  strategyWETH,
  strategyUSDC,
  strategyUSDT,
  strategyWBTC,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const OasyslendConfig: IOasyslendConfiguration = {
  ...CommonsConfig,
  MarketId: 'Oasyslend genesis market',
  ProviderId: 1,
  ReservesConfig: {
    WETH: strategyWETH,
    WOAS: strategyWOAS,
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WBTC: strategyWBTC,
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.tenderly]: {},
    [eOasysNetwork.testnet]: {
      WOAS: 'TODO',
      WETH: 'TODO',
      USDC: 'TODO',
      USDT: 'TODO',
      WBTC: 'TODO',
    },
    [eOasysNetwork.oasys]: {
      WOAS: 'TODO',
      WETH: 'TODO',
      USDC: 'TODO',
      USDT: 'TODO',
      WBTC: 'TODO',
    },
  },
};

export default OasyslendConfig;
