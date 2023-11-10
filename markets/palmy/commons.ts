import {
  MOCK_PRICE_AGGREGATORS_PRICES,
  oneRay,
  oneUsd,
  ZERO_ADDRESS,
} from '../../helpers/constants';
import { eEthereumNetwork, ICommonConfiguration } from '../../helpers/types';
import { eOasysNetwork } from './../../helpers/types';

// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------

export const CommonsConfig: ICommonConfiguration = {
  MarketId: 'Commons',
  LTokenNamePrefix: 'Palmy interest bearing',
  StableDebtTokenNamePrefix: 'Palmy stable debt bearing',
  VariableDebtTokenNamePrefix: 'Palmy variable debt bearing',
  SymbolPrefix: '',
  ProviderId: 0, // Overriden in index.ts
  OracleQuoteCurrency: 'USD',
  OracleQuoteUnit: oneUsd.toString(),
  ProtocolGlobalParams: {
    TokenDistributorPercentageBase: '10000',
    MockUsdPriceInWei: '5848466240000000',
    UsdAddress: '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96',
    NilAddress: '0x0000000000000000000000000000000000000000',
    OneAddress: '0x0000000000000000000000000000000000000001',
    PalmyReferral: '0',
  },

  // ----------------
  // COMMON PROTOCOL PARAMS ACROSS POOLS AND NETWORKS
  // ----------------

  Mocks: {
    AllAssetsInitialPrices: {
      ...MOCK_PRICE_AGGREGATORS_PRICES,
    },
  },
  LendingRateOracleRatesCommon: {
    WETH: {
      borrowRate: oneRay.multipliedBy(0.03).toFixed(),
    },
    WOAS: {
      borrowRate: oneRay.multipliedBy(0.039).toFixed(),
    },
    USDT: {
      borrowRate: oneRay.multipliedBy(0.039).toFixed(),
    },
    USDC: {
      borrowRate: oneRay.multipliedBy(0.039).toFixed(),
    },
    WBTC: {
      borrowRate: oneRay.multipliedBy(0.03).toFixed(),
    },
  },
  // ----------------
  // COMMON PROTOCOL ADDRESSES ACROSS POOLS
  // ----------------

  // If PoolAdmin/emergencyAdmin is set, will take priority over PoolAdminIndex/emergencyAdminIndex
  PoolAdmin: {
    [eEthereumNetwork.buidlerevm]: undefined,
    [eEthereumNetwork.coverage]: undefined,
    [eEthereumNetwork.hardhat]: undefined,
    [eEthereumNetwork.tenderly]: undefined,
    [eOasysNetwork.testnet]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
    [eOasysNetwork.oasys]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
  },
  PoolAdminIndex: 0,
  EmergencyAdmin: {
    [eEthereumNetwork.buidlerevm]: undefined,
    [eEthereumNetwork.coverage]: undefined,
    [eEthereumNetwork.hardhat]: undefined,
    [eEthereumNetwork.tenderly]: undefined,
    [eOasysNetwork.testnet]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
    [eOasysNetwork.oasys]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
  },
  EmergencyAdminIndex: 1,
  ProviderRegistry: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0x52D306e36E3B6B02c153d0266ff0f85d18BCD413',
    [eOasysNetwork.testnet]: '0x436f90A3bAFB5781FaC2C1e7bec46b4822a2c177',
    [eOasysNetwork.oasys]: 'TODO',
  },
  ProviderRegistryOwner: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0xB9062896ec3A615a4e4444DF183F0531a77218AE',
    [eOasysNetwork.testnet]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
    [eOasysNetwork.oasys]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
  },
  LendingRateOracle: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0x8A32f49FFbA88aba6EFF96F45D8BD1D4b3f35c7D',
    [eOasysNetwork.testnet]: '0x1D1F1b2a4f32C7775B8f3D453d2238047688affc',
    [eOasysNetwork.oasys]: 'TODO',
  },
  LendingPoolCollateralManager: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0xbd4765210d4167CE2A5b87280D9E8Ee316D5EC7C',
    [eOasysNetwork.testnet]: '0xAACe8Bc972534A47A590F2EDd8e312B4A675f978',
    [eOasysNetwork.oasys]: 'TODO',
  },
  LendingPoolConfigurator: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '',
    [eOasysNetwork.testnet]: '0x7081A30BBFFce995F33704875F9F3449b7dA0215', // LendingPoolConfiguratorImpl
    [eOasysNetwork.oasys]: 'TODO', // LendingPoolConfiguratorImpl
  },
  LendingPool: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '',
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  WethGateway: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '',
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  TokenDistributor: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0xe3d9988f676457123c5fd01297605efdd0cba1ae',
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  DIAAggregatorAddress: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '',
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  PriceAggregator: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0xA50ba011c48153De246E5192C8f9258A2ba79Ca9',
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  PalmyOracle: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '',
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  FallbackOracle: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: ZERO_ADDRESS,
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  ChainlinkAggregator: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.tenderly]: {},
    [eOasysNetwork.testnet]: {},
    [eOasysNetwork.oasys]: {},
  },
  DIAAggregator: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.tenderly]: {},
    [eOasysNetwork.testnet]: {
      WETH: '0x7C7dDDB4DD58300168DC652e2c2fB787B6f6aE54', // TODO
      WOAS: '0x5200000000000000000000000000000000000001',
      WBTC: '0xB9F1fb5c7dd67F3F249E42025E4255F402B535a0',
      USDT: '0xCE7d7E94D5B282b7AC751b8A5d543683910EC6BD',
      USDC: '0x7Fe705e1734Eb40484D41016190155250C2f69AA',
    },
    [eOasysNetwork.oasys]: {
      WETH: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', // TODO
      WOAS: '0x5200000000000000000000000000000000000001',
      WBTC: 'TODO',
      USDT: 'TODO',
      USDC: 'TODO',
    },
  },
  ReserveAssets: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.tenderly]: {},
    [eOasysNetwork.testnet]: {},
    [eOasysNetwork.oasys]: {},
  },
  ReservesConfig: {},
  LTokenDomainSeparator: {
    [eEthereumNetwork.buidlerevm]:
      '0xbae024d959c6a022dc5ed37294cd39c141034b2ae5f02a955cce75c930a81bf5',
    [eEthereumNetwork.coverage]:
      '0x95b73a72c6ecf4ccbbba5178800023260bad8e75cdccdb8e4827a2977a37c820',
    [eEthereumNetwork.hardhat]:
      '0xbae024d959c6a022dc5ed37294cd39c141034b2ae5f02a955cce75c930a81bf5',
    [eEthereumNetwork.tenderly]: '',
    [eOasysNetwork.testnet]: '',
    [eOasysNetwork.oasys]: '',
  },
  WETH: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    [eOasysNetwork.testnet]: '',
    [eOasysNetwork.oasys]: '',
  },
  WrappedNativeToken: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    [eOasysNetwork.testnet]: '0x5200000000000000000000000000000000000001', //WOAS
    [eOasysNetwork.oasys]: '0x5200000000000000000000000000000000000001', //WOAS
  },
  ReserveFactorTreasuryAddress: {
    [eEthereumNetwork.buidlerevm]: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
    [eEthereumNetwork.coverage]: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
    [eEthereumNetwork.hardhat]: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
    [eEthereumNetwork.tenderly]: '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
    [eOasysNetwork.testnet]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
    [eOasysNetwork.oasys]: 'TODO',
  },
  IncentivesController: {
    [eEthereumNetwork.buidlerevm]: ZERO_ADDRESS,
    [eEthereumNetwork.coverage]: ZERO_ADDRESS,
    [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
    [eEthereumNetwork.tenderly]: ZERO_ADDRESS,
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
  StakedOas: {
    [eEthereumNetwork.buidlerevm]: ZERO_ADDRESS,
    [eEthereumNetwork.coverage]: ZERO_ADDRESS,
    [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
    [eEthereumNetwork.tenderly]: ZERO_ADDRESS,
    [eOasysNetwork.testnet]: 'TODO',
    [eOasysNetwork.oasys]: 'TODO',
  },
};
