import { ZERO_ADDRESS } from '../../helpers/constants';
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
  strategyMCHC,
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
    MCHC: strategyMCHC,
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
      USDC: '0xA36bb2502E4a8Af486ee99388b6033FBfc466a4f',
    },
    [eOasysNetwork.oasys]: {
      WOAS: '0x5200000000000000000000000000000000000001',
      WETH: '0x5801E5a61164024Be2554248E33127c6ebC8C113',
      WBTC: '0xdd30c42D57a0f14DD44c809F59836D57392FDbC9',
      USDC: '0x4D17C0609B77e456Fb98Ea99a62bCeF09adae32D',
      MCHC: '0x5B1CC635E524cAbb63a581c050C895534755F297',
    },
  },
};

export default PalmyConfig;
