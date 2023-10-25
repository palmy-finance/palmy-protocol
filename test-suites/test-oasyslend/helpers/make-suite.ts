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
  usdc: MintableERC20;
  usdt: MintableERC20;
  wbtc: MintableERC20;
  lDai: LToken;
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
  usdt: {} as MintableERC20,
  wbtc: {} as MintableERC20,
  usdc: {} as MintableERC20,
  lDai: {} as LToken,
  addressesProvider: {} as LendingPoolAddressesProvider,
  registry: {} as LendingPoolAddressesProviderRegistry,
  wethGateway: {} as WETHGateway,
} as TestEnv;

export async function initializeMakeSuite() {
  console.log('initialize make suite start');
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
  const lusdcAddress = allTokens.find((lToken) => lToken.symbol === 'lUSDC')?.tokenAddress;
  const lusdtAddress = allTokens.find((lToken) => lToken.symbol === 'lUSDT')?.tokenAddress;
  const lwbtcAddress = allTokens.find((lToken) => lToken.symbol === 'lWBTC')?.tokenAddress;

  const reservesTokens = await testEnv.helpersContract.getAllReservesTokens();

  const daiAddress = reservesTokens.find((token) => token.symbol === 'DAI')?.tokenAddress;
  const wethAddress = reservesTokens.find((token) => token.symbol === 'WETH')?.tokenAddress;
  const usdcAddress = reservesTokens.find((token) => token.symbol === 'USDC')?.tokenAddress;
  const usdtAddress = reservesTokens.find((token) => token.symbol === 'USDT')?.tokenAddress;
  const wbtcAddress = reservesTokens.find((token) => token.symbol === 'WBTC')?.tokenAddress;

  if (!lDaiAddress || !lWETHAddress || !lusdcAddress || !lusdtAddress || !lwbtcAddress) {
    console.error(
      'lToken address is not defined',
      lDaiAddress,
      lWETHAddress,
      lusdcAddress,
      lusdtAddress,
      lwbtcAddress
    );
    process.exit(1);
  }
  if (!daiAddress || !wethAddress || !usdcAddress || !usdtAddress || !wbtcAddress) {
    console.error(
      'reserve token address is not defined',
      daiAddress,
      wethAddress,
      usdcAddress,
      usdtAddress,
      wbtcAddress
    );
    process.exit(1);
  }

  testEnv.lDai = await getLToken(lDaiAddress);
  testEnv.lWETH = await getLToken(lWETHAddress);

  testEnv.dai = await getMintableERC20(daiAddress);
  testEnv.weth = await getWETHMocked(wethAddress);
  testEnv.usdc = await getMintableERC20(usdcAddress);
  testEnv.usdt = await getMintableERC20(usdtAddress);
  testEnv.wbtc = await getMintableERC20(wbtcAddress);

  testEnv.wethGateway = await getWETHGateway();
  console.log('initialize make suite end');
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
