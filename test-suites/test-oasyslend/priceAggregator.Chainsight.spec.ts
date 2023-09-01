import BigNumber from 'bignumber.js';
import { evmSnapshot } from '../../helpers/misc-utils';
import { PriceAggregatorAdapterChainsightImpl } from '../../types';
import {
  deployChainsightOracle,
  deployPriceAggregatorChainsightImpl,
} from '../../helpers/contracts-deployments';
import { makeSuite, TestEnv } from './helpers/make-suite';
import { getChainsightOracle, getFirstSigner } from '../../helpers/contracts-getters';

const { expect } = require('chai');
const oneEther = new BigNumber(Math.pow(10, 18));

const mockPrices = () => {
  return [
    {
      price: oneEther.multipliedBy('0.00367714136416').toFixed(),
      tokenAddress: '0xDAC17F958D2Ee523a2206206994597C13d831ec1',
      symbol: 'WETH',
    },
    {
      price: oneEther.toFixed(),
      tokenAddress: '0xDac17f958D2eE523a2206206994597c13d831EC2',
      symbol: 'OAS',
    },
  ];
};

// NOTE: fail "after all" in this test suite
//   "after all" hook in "Price Aggregator Implementation for Chainsight"
makeSuite('Price Aggregator Implementation for Chainsight', (testEnv: TestEnv) => {
  const prices = mockPrices();
  let evmSnapshotId;
  let aggregator: PriceAggregatorAdapterChainsightImpl;
  beforeEach(async () => {
    evmSnapshotId = await evmSnapshot();
  });

  before(async () => {
    aggregator = await await deployPriceAggregatorChainsightImpl();
    for (const p of prices) {
      await deployChainsightOracle(p.symbol, false);
    }
  });

  describe('PriceAggregatorAdapterChainsightImpl', () => {
    describe('setAssetSources', () => {
      it('asset source update', async () => {
        for (const p of prices) {
          const oracle = await getChainsightOracle(p.symbol);
          await oracle.updateState(p.price);

          await aggregator.setAssetSources(
            [p.tokenAddress],
            [oracle.address],
            [await (await getFirstSigner()).getAddress()]
          );
          console.log('set asset source');
          const price = await aggregator.currentPrice(p.tokenAddress);
          expect(price.toString()).to.be.equal(p.price);
        }
      });
    });
  });
});
