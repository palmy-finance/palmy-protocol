import BigNumber from 'bignumber.js';
import { oneRay } from '../../helpers/constants';
import { IInterestRateStrategyParams } from '../../helpers/types';

// USDC USDT
export const rateStrategyStable: IInterestRateStrategyParams = {
  name: 'rateStrategyStable',
  optimalUtilizationRate: new BigNumber(0.9).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.04).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(0.6).multipliedBy(oneRay).toFixed(),
  stableRateSlope1: new BigNumber(0.02).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(0.6).multipliedBy(oneRay).toFixed(),
};

// WETH
export const rateStrategyWETH: IInterestRateStrategyParams = {
  name: 'rateStrategyWETH',
  optimalUtilizationRate: new BigNumber(0.65).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.08).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(1).multipliedBy(oneRay).toFixed(),
};
export const rateStrategyWOAS: IInterestRateStrategyParams = {
  name: 'rateStrategyWOAS',
  optimalUtilizationRate: new BigNumber(0.45).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.07).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
  stableRateSlope1: new BigNumber(0.1).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(3).multipliedBy(oneRay).toFixed(),
};

// DAI only for test
export const rateStrategyStableTwo: IInterestRateStrategyParams = {
  name: 'rateStrategyStableTwo',
  optimalUtilizationRate: new BigNumber(0.8).multipliedBy(oneRay).toFixed(),
  baseVariableBorrowRate: new BigNumber(0).multipliedBy(oneRay).toFixed(),
  variableRateSlope1: new BigNumber(0.04).multipliedBy(oneRay).toFixed(),
  variableRateSlope2: new BigNumber(0.75).multipliedBy(oneRay).toFixed(),
  stableRateSlope1: new BigNumber(0.02).multipliedBy(oneRay).toFixed(),
  stableRateSlope2: new BigNumber(0.75).multipliedBy(oneRay).toFixed(),
};
