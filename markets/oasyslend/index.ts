import {
  eOasysNetwork,
  eEthereumNetwork,
  IOasyslendConfiguration as IOasyslendConfiguration,
} from '../../helpers/types';
import { CommonsConfig } from './commons';
import {
  strategyBNB,
  strategyBUSD,
  strategyDAI,
  strategyDOT,
  strategyLAY,
  strategyMATIC,
  strategyUSDC,
  strategyAUSD,
  strategyUSDT,
  strategyWASTR,
  strategyWBTC,
  strategyWETH,
  strategyWSDN,
} from './reservesConfigs';

// ----------------
// POOL--SPECIFIC PARAMS
// ----------------

export const OasyslendConfig: IOasyslendConfiguration = {
  ...CommonsConfig,
  MarketId: 'Oasyslend genesis market',
  ProviderId: 1,
  ReservesConfig: {
    LAY: strategyLAY,
    USDC: strategyUSDC,
    USDT: strategyUSDT,
    WBTC: strategyWBTC,
    WETH: strategyWETH,
    WASTR: strategyWASTR,
    WSDN: strategyWSDN,
    DAI: strategyDAI,
    BUSD: strategyBUSD,
    MATIC: strategyMATIC,
    BNB: strategyBNB,
    DOT: strategyDOT,
    AUSD: strategyAUSD,
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.tenderly]: {},
    [eOasysNetwork.testnet]: {
      WASTR: '0x44a26AE046a01d99eBAbecc24B4d61B388656871',
      WSDN: '0x7cA69766F4be8Ec93dD01E1d571e64b867455e58',
      WETH: '0x72fE832eB0452285e91CA9F46B85229A5107CeE8',
      WBTC: '0xEdAA9f408ac11339766a4E5e0d4653BDee52fcA1',
      USDT: '0xdB25FDCCe3E63B376D308dC2D46234632d9959d8',
      USDC: '0x458db3bEf6ffC5212f9359bbDAeD0D5A58129397',
      LAY: '0xb163716cb6c8b0a56e4f57c394A50F173E34181b',
      BUSD: '0x0156412a53C6cc607135C7D6374913C5DDF8E55E',
      DAI: '0x257f1a047948f73158DaDd03eB84b34498bCDc60',
      MATIC: '0xb0107B84C41eD7bda37495D318116FC42826a423',
      BNB: '0x3508e7Fb724Ba0E01dA868EbcbEdC05f4f3d969D',
      DOT: '0x1135874985e7F1342bCa07201B102eFc1292b6d9',
      AUSD: '',
      NativeUSDT: '',
    },
    [eOasysNetwork.oasys]: {
      WASTR: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
      WSDN: '0x75364D4F779d0Bd0facD9a218c67f87dD9Aff3b4',
      WETH: '0x81ECac0D6Be0550A00FF064a4f9dd2400585FE9c',
      WBTC: '0xad543f18cFf85c77E140E3E5E3c3392f6Ba9d5CA',
      USDT: '0x3795C36e7D12A8c252A20C5a7B455f7c57b60283',
      USDC: '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98',
      LAY: '0xc4335B1b76fA6d52877b3046ECA68F6E708a27dd',
      BUSD: '0x4bf769b05e832fcdc9053fffbc78ca889acb5e1e',
      DAI: '0x6De33698e9e9b787e09d3Bd7771ef63557E148bb',
      MATIC: '0xdd90E5E87A2081Dcf0391920868eBc2FFB81a1aF',
      BNB: '0x7f27352D5F83Db87a5A3E00f4B07Cc2138D8ee52',
      DOT: '0xffffffffffffffffffffffffffffffffffffffff',
      AUSD: '0xfFFFFfFF00000000000000010000000000000001',
      NativeUSDT: '0xfFFfffFF000000000000000000000001000007C0',
    },
  },
};

export default OasyslendConfig;
