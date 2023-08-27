import { task } from 'hardhat/config';
import { deployMintableERC20 } from '../../helpers/contracts-deployments';
import { registerContractInJsonDb } from '../../helpers/contracts-helpers';
import { TokenContractId } from '../../helpers/types';

const deployMockTokenAndRecordJson = async ({
  key,
  name,
  symbol,
  decimals,
}: {
  key: (typeof TokenContractId)[number];
  name: string;
  symbol: string;
  decimals: string;
}) => {
  const instance = await deployMintableERC20([name, symbol, decimals], false);
  await registerContractInJsonDb(key.toUpperCase(), instance);
};

task('dev:deploy-mock-token:matic', 'dev:deploy-mock-token:matic').setAction(
  async ({}, localBRE) => {
    await localBRE.run('set-DRE');

    await deployMockTokenAndRecordJson({
      key: 'MATIC',
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: '18',
    });
  }
);

task('dev:deploy-mock-token:bnb', 'dev:deploy-mock-token:bnb').setAction(async ({}, localBRE) => {
  await localBRE.run('set-DRE');

  await deployMockTokenAndRecordJson({
    key: 'BNB',
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: '18',
  });
});
