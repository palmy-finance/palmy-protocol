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
    [eOasysNetwork.oasys]: '0x8c44Be9aA5da85A6d0FC57afF12CE33CA2f01C6c',
  },
  EmergencyAdminIndex: 1,

  ProviderRegistryOwner: {
    [eEthereumNetwork.buidlerevm]: '',
    [eEthereumNetwork.coverage]: '',
    [eEthereumNetwork.hardhat]: '',
    [eEthereumNetwork.tenderly]: '0xB9062896ec3A615a4e4444DF183F0531a77218AE',
    [eOasysNetwork.testnet]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
    [eOasysNetwork.oasys]: '0x21AFfDf04c787EB34f6Eda911d67CbA5D75d7773',
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
      USDC: '0xA36bb2502E4a8Af486ee99388b6033FBfc466a4f',
    },
    [eOasysNetwork.oasys]: {
      WETH: '0x5801E5a61164024Be2554248E33127c6ebC8C113',
      WOAS: '0x5200000000000000000000000000000000000001',
      WBTC: '0xdd30c42D57a0f14DD44c809F59836D57392FDbC9',
      USDC: '0x4D17C0609B77e456Fb98Ea99a62bCeF09adae32D',
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
    [eOasysNetwork.oasys]: '0x922E396E1bFD3FD9B3171324cEfD8bC82A5e6271',
  },
  IncentivesController: {
    [eEthereumNetwork.buidlerevm]: ZERO_ADDRESS,
    [eEthereumNetwork.coverage]: ZERO_ADDRESS,
    [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
    [eEthereumNetwork.tenderly]: ZERO_ADDRESS,
    [eOasysNetwork.testnet]: '0x00B0Bb2936aE698C2580f7044C4d8b49ac21DA62', // PullRewardsIncentivesControllerProxy
    [eOasysNetwork.oasys]: '0x29C903EBEdAD12C813D4ce6f0fFfEd540d13Dc38',
  },
  StakedOas: {
    [eEthereumNetwork.buidlerevm]: ZERO_ADDRESS,
    [eEthereumNetwork.coverage]: ZERO_ADDRESS,
    [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
    [eEthereumNetwork.tenderly]: ZERO_ADDRESS,
    [eOasysNetwork.testnet]: '0xA1C7de66b1eF4Da8dA3542D9Cb9C750107Dea479',
    [eOasysNetwork.oasys]: '0x7bBd0c193Be214630F9489D6C7CD883ae3155701',
  },
  OracleSenderAddress: {
    [eEthereumNetwork.buidlerevm]: ZERO_ADDRESS,
    [eEthereumNetwork.coverage]: ZERO_ADDRESS,
    [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
    [eEthereumNetwork.tenderly]: ZERO_ADDRESS,
    [eOasysNetwork.testnet]: ZERO_ADDRESS,
    [eOasysNetwork.oasys]: '0x99c3bbb8e936c56bb4defd50b3f2ed3ff0b07f1b',
  },
  OraclePriceKey: {
    [eEthereumNetwork.buidlerevm]: {},
    [eEthereumNetwork.coverage]: {},
    [eEthereumNetwork.hardhat]: {},
    [eEthereumNetwork.tenderly]: {},
    [eOasysNetwork.testnet]: {},
    [eOasysNetwork.oasys]: {
      WETH: '0x375F1FEC2CB36B7C91A0122050A940EF3ADCEC6BB2D6A732C97FD750E59EED86',
      WOAS: '0xD5FDD1EE2E8F7AC4E2578FD073F8E6B38F2E7550920672373AFF2BAF12B82FD5',
      WBTC: '0x39CAC50230EA332C885D0A17AB63167C71FAA43FF9BCAF89506F30F9AD2FFB57',
      USDC: '0x31FC97C81E10911D68D3FC16624B03CEAC40C5C784E6BF0FA46ECD3EE7EDC655',
    },
  },
  LendingPoolConfigurator: {
    [eEthereumNetwork.buidlerevm]: ZERO_ADDRESS,
    [eEthereumNetwork.coverage]: ZERO_ADDRESS,
    [eEthereumNetwork.hardhat]: ZERO_ADDRESS,
    [eEthereumNetwork.tenderly]: ZERO_ADDRESS,
    [eOasysNetwork.testnet]: ZERO_ADDRESS,
    [eOasysNetwork.oasys]: '0xBA55b646837190e293989643197D3ce3dDFe1Ab4',
  },
};
