import {
  eOasysNetwork,
  eEthereumNetwork,
  IOasyslendConfiguration as IOasyslendConfiguration,
} from '../../helpers/types';
import { CommonsConfig } from './commons';
import { strategyWOAS, strategyWETH } from './reservesConfigs';

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
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.tenderly]: {},
    [eOasysNetwork.testnet]: {
      WOAS: '0x44a26AE046a01d99eBAbecc24B4d61B388656871',
      WETH: '0x72fE832eB0452285e91CA9F46B85229A5107CeE8',
    },
    [eOasysNetwork.oasys]: {
      WOAS: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
      WETH: '0x81ECac0D6Be0550A00FF064a4f9dd2400585FE9c',
    },
  },
};

export default OasyslendConfig;
