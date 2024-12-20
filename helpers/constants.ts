import BigNumber from 'bignumber.js';

export const PERMISSIONED_CONTRACT_FACTORY_ADDRESS = '0x123e3ae459a8D049F27Ba62B8a5D48c68A100EBC';

// ----------------
// MATH
// ----------------

export const PERCENTAGE_FACTOR = '10000';
export const HALF_PERCENTAGE = '5000';
export const WAD = Math.pow(10, 18).toString();
export const HALF_WAD = new BigNumber(WAD).multipliedBy(0.5).toString();
export const RAY = new BigNumber(10).exponentiatedBy(27).toFixed();
export const HALF_RAY = new BigNumber(RAY).multipliedBy(0.5).toFixed();
export const WAD_RAY_RATIO = Math.pow(10, 9).toString();
export const oneEther = new BigNumber(Math.pow(10, 18));
export const oneUsd = new BigNumber(Math.pow(10, 8));
export const oneRay = new BigNumber(Math.pow(10, 27));
export const MAX_UINT_AMOUNT =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';
export const ONE_YEAR = '31536000';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ONE_ADDRESS = '0x0000000000000000000000000000000000000001';
// ----------------
// PROTOCOL GLOBAL PARAMS
// ----------------
export const OPTIMAL_UTILIZATION_RATE = new BigNumber(0.8).times(RAY);
export const EXCESS_UTILIZATION_RATE = new BigNumber(0.2).times(RAY);
export const APPROVAL_AMOUNT_LENDING_POOL = '1000000000000000000000000000';
export const TOKEN_DISTRIBUTOR_PERCENTAGE_BASE = '10000';
export const MOCK_USD_PRICE_IN_WEI = '5848466240000000';
export const USD_ADDRESS = '0x10F7Fc1F91Ba351f9C629c5947AD69bD03C05b96';
export const OASYSLEND_REFERRAL = '0';

// to set initial prices in fallback oracle
export const INITIAL_PRICES = {
  USD: oneUsd.toFixed(),
  WETH: oneUsd.multipliedBy('2555.73492766').toFixed(),
  WOAS: oneUsd.multipliedBy('0.70356687').toFixed(),
  USDC: oneUsd.multipliedBy('0.98889786').toFixed(),
  USDT: oneUsd.toFixed(),
  WBTC: oneUsd.multipliedBy('37561.51135465').toFixed(),
};

export const MOCK_PRICE_AGGREGATORS_PRICES = {
  // Update to USD-based price feeds
  WETH: oneEther.toFixed(),
  WOAS: oneEther.multipliedBy('0.003620948469').toFixed(),
  USD: oneEther.multipliedBy('0.00369068412860').toFixed(),
  USDC: oneEther.multipliedBy('0.00367714136416').toFixed(),
  USDT: oneEther.multipliedBy('0.00369068412860').toFixed(),
  WBTC: oneEther.multipliedBy('47.332685').toFixed(),
  MCHC: oneEther.multipliedBy('0.00369068412860').toFixed(),
};

export const ALL_ASSETS_PRICES_FOR_TESTING = {
  ...MOCK_PRICE_AGGREGATORS_PRICES,
  DAI: oneEther.multipliedBy('0.00369068412860').toFixed(),
};

// PriceAggregatorAddress
export const aggregatorProxy = {
  tenderly: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
  oasys: '0x043C93fF4d52B2F76811852644549553A00309a8',
  shiden: '0xBE38fe6439269d18190024DA4f2Cfc35323A8384',
  shibuya: '0xA4865374f35536103e1671631996bbf4e92ba566',
};

export const baseTokenAddress = {
  oasys: '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720',
  shiden: '0x44a26AE046a01d99eBAbecc24B4d61B388656871',
  shibuya: '0x8Fd43fea01125EcA2bEb0bB03509946ECA99eEf9',
};
