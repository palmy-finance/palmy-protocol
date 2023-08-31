import chai from 'chai';
// @ts-ignore
import bignumberChai from 'chai-bignumber';
import { solidity } from 'ethereum-waffle';
import { Signer } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  getLendingPool,
  getLendingPoolAddressesProvider,
  getLendingPoolAddressesProviderRegistry,
  getLendingPoolConfiguratorProxy,
  getLToken,
  getMintableERC20,
  getPriceOracle,
  getOasyslendProtocolDataProvider,
  getWETHGateway,
  getWETHMocked,
} from '../../../helpers/contracts-getters';
import { getEthersSigners, getParamPerNetwork } from '../../../helpers/contracts-helpers';
import { DRE, evmRevert, evmSnapshot } from '../../../helpers/misc-utils';
import { usingTenderly } from '../../../helpers/tenderly-utils';
import { eNetwork, tEthereumAddress } from '../../../helpers/types';
import { OasyslendConfig } from '../../../markets/oasyslend';
import { LendingPool } from '../../../types/LendingPool';
import { LendingPoolAddressesProvider } from '../../../types/LendingPoolAddressesProvider';
import { LendingPoolAddressesProviderRegistry } from '../../../types/LendingPoolAddressesProviderRegistry';
import { LendingPoolConfigurator } from '../../../types/LendingPoolConfigurator';
import { LToken } from '../../../types/LToken';
import { MintableERC20 } from '../../../types/MintableERC20';
import { PriceOracle } from '../../../types/PriceOracle';
import { OasyslendProtocolDataProvider } from '../../../types/OasyslendProtocolDataProvider';
import { WETH9Mocked } from '../../../types/WETH9Mocked';
import { WETHGateway } from '../../../types/WETHGateway';
import { almostEqual } from './almost-equal';

chai.use(bignumberChai());
chai.use(almostEqual());
chai.use(solidity);

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  deployer: SignerWithAddress;
  users: SignerWithAddress[];
  pool: LendingPool;
  configurator: LendingPoolConfigurator;
  oracle: PriceOracle;
  helpersContract: OasyslendProtocolDataProvider;
  weth: WETH9Mocked;
  lWETH: LToken;
  dai: MintableERC20;
  lDai: LToken;
  oal: MintableERC20;
  addressesProvider: LendingPoolAddressesProvider;
  registry: LendingPoolAddressesProviderRegistry;
  wethGateway: WETHGateway;
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  buidlerevmSnapshotId = id;
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  pool: {} as LendingPool,
  configurator: {} as LendingPoolConfigurator,
  helpersContract: {} as OasyslendProtocolDataProvider,
  oracle: {} as PriceOracle,
  weth: {} as WETH9Mocked,
  lWETH: {} as LToken,
  dai: {} as MintableERC20,
  lDai: {} as LToken,
  usdc: {} as MintableERC20,
  oal: {} as MintableERC20,
  wsdn: {} as MintableERC20,
  addressesProvider: {} as LendingPoolAddressesProvider,
  registry: {} as LendingPoolAddressesProviderRegistry,
  wethGateway: {} as WETHGateway,
} as TestEnv;

export async function initializeMakeSuite() {
  const [_deployer, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnv.deployer = deployer;
  testEnv.pool = await getLendingPool();

  testEnv.configurator = await getLendingPoolConfiguratorProxy();

  testEnv.addressesProvider = await getLendingPoolAddressesProvider();

  if (process.env.FORK) {
    testEnv.registry = await getLendingPoolAddressesProviderRegistry(
      getParamPerNetwork(OasyslendConfig.ProviderRegistry, process.env.FORK as eNetwork)
    );
  } else {
    testEnv.registry = await getLendingPoolAddressesProviderRegistry();
    testEnv.oracle = await getPriceOracle();
  }

  testEnv.helpersContract = await getOasyslendProtocolDataProvider();

  const allTokens = await testEnv.helpersContract.getAllLTokens();
  const lDaiAddress = allTokens.find((lToken) => lToken.symbol === 'lDAI')?.tokenAddress;
  const lWETHAddress = allTokens.find((lToken) => lToken.symbol === 'lWETH')?.tokenAddress;

  const reservesTokens = await testEnv.helpersContract.getAllReservesTokens();

  const daiAddress = reservesTokens.find((token) => token.symbol === 'DAI')?.tokenAddress;
  const oalAddress = reservesTokens.find((token) => token.symbol === 'OAL')?.tokenAddress;
  const wethAddress = reservesTokens.find((token) => token.symbol === 'WETH')?.tokenAddress;

  if (!lDaiAddress || !lWETHAddress) {
    process.exit(1);
  }
  if (!daiAddress || !oalAddress || !wethAddress) {
    process.exit(1);
  }

  testEnv.lDai = await getLToken(lDaiAddress);
  testEnv.lWETH = await getLToken(lWETHAddress);

  testEnv.dai = await getMintableERC20(daiAddress);
  testEnv.oal = await getMintableERC20(oalAddress);
  testEnv.weth = await getWETHMocked(wethAddress);
  testEnv.wethGateway = await getWETHGateway();
}

const setSnapshot = async () => {
  const hre = DRE as HardhatRuntimeEnvironment;
  if (usingTenderly()) {
    setBuidlerevmSnapshotId((await hre.tenderlyNetwork.getHead()) || '0x1');
    return;
  }
  setBuidlerevmSnapshotId(await evmSnapshot());
};

const revertHead = async () => {
  const hre = DRE as HardhatRuntimeEnvironment;
  if (usingTenderly()) {
    await hre.tenderlyNetwork.setHead(buidlerevmSnapshotId);
    return;
  }
  await evmRevert(buidlerevmSnapshotId);
};

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      await setSnapshot();
    });
    tests(testEnv);
    after(async () => {
      await revertHead();
    });
  });
}
