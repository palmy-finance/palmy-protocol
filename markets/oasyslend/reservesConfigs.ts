import { eContractid, IReserveParams } from '../../helpers/types';
import { rateStrategyStableTwo, rateStrategyWOAS, rateStrategyWETH } from './rateStrategies';

export const strategyDAIForTest: IReserveParams = {
  strategy: rateStrategyStableTwo,
  baseLTVAsCollateral: '7500',
  liquidationThreshold: '8000',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: true,
  reserveDecimals: '18',
  lTokenImpl: eContractid.LToken,
  reserveFactor: '1000',
};

export const strategyWETH: IReserveParams = {
  strategy: rateStrategyWETH,
  baseLTVAsCollateral: '8000',
  liquidationThreshold: '8500',
  liquidationBonus: '10500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  reserveDecimals: '18',
  lTokenImpl: eContractid.LToken,
  reserveFactor: '1000',
};

export const strategyWOAS: IReserveParams = {
  strategy: rateStrategyWOAS,
  baseLTVAsCollateral: '4000',
  liquidationThreshold: '5500',
  liquidationBonus: '11500',
  borrowingEnabled: true,
  stableBorrowRateEnabled: false,
  reserveDecimals: '18',
  lTokenImpl: eContractid.LToken,
  reserveFactor: '2000',
};
