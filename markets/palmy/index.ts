import {
  eOasysNetwork,
  eEthereumNetwork,
  IPalmyConfiguration as IPalmyConfiguration,
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

export const PalmyConfig: IPalmyConfiguration = {
  ...CommonsConfig,
  MarketId: 'Palmy genesis market',
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
      WETH: '0x7C7dDDB4DD58300168DC652e2c2fB787B6f6aE54', // TODO
      WOAS: '0x5200000000000000000000000000000000000001',
      WBTC: '0xB9F1fb5c7dd67F3F249E42025E4255F402B535a0',
      USDT: '0xCE7d7E94D5B282b7AC751b8A5d543683910EC6BD',
      USDC: '0x7Fe705e1734Eb40484D41016190155250C2f69AA',
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

export default PalmyConfig;
