import { readArtifact as buidlerReadArtifact } from '@nomiclabs/buidler/plugins';
import { BytesLike, Contract, Signer } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import {
  DefaultReserveInterestRateStrategyFactory,
  DelegationAwareLTokenFactory,
  InitializableAdminUpgradeabilityProxyFactory,
  LendingPoolAddressesProviderFactory,
  LendingPoolAddressesProviderRegistryFactory,
  LendingPoolCollateralManagerFactory,
  LendingPoolConfiguratorFactory,
  LendingPoolFactory,
  LendingRateOracleFactory,
  LTokenFactory,
  LTokensAndRatesHelperFactory,
  MintableDelegationERC20Factory,
  MintableERC20Factory,
  MockAggregatorFactory,
  MockFlashLoanReceiverFactory,
  MockLTokenFactory,
  MockStableDebtTokenFactory,
  MockVariableDebtTokenFactory,
  PriceOracleFactory,
  ReserveLogicFactory,
  SelfdestructTransferFactory,
  StableDebtTokenFactory,
  StakeUIHelperFactory,
  PalmyFallbackOracleFactory,
  PalmyOracleFactory,
  PalmyProtocolDataProviderFactory,
  UiIncentiveDataProviderV2Factory,
  UiPoolDataProviderV2Factory,
  VariableDebtTokenFactory,
  WalletBalanceProviderFactory,
  WETH9MockedFactory,
  WETHGatewayFactory,
  ChainsightOracleFactory,
} from '../types';
import { LendingPoolLibraryAddresses } from '../types/LendingPoolFactory';
import { MintableDelegationERC20 } from '../types/MintableDelegationERC20';
import { MintableERC20 } from '../types/MintableERC20';
import { StableAndVariableTokensHelperFactory } from '../types/StableAndVariableTokensHelperFactory';
import { WETH9Mocked } from '../types/WETH9Mocked';
import { PriceAggregatorAdapterChainsightImplFactory } from './../types/PriceAggregatorAdapterChainsightImplFactory';
import {
  ConfigNames,
  getGenesisPoolAdmin,
  getQuoteCurrency,
  getReservesConfigByPool,
  getWrappedNativeTokenAddress,
  loadPoolConfig,
} from './configuration';
import { getFirstSigner } from './contracts-getters';
import {
  getContractAddressWithJsonFallback,
  getEthersSigners,
  getOptionalParamAddressPerNetwork,
  insertContractAddressInDb,
  linkBytecode,
  registerContractInJsonDb,
  withSaveAndVerify,
} from './contracts-helpers';
import { DRE, notFalsyOrZeroAddress } from './misc-utils';
import {
  eContractid,
  eEthereumNetwork,
  eNetwork,
  IReserveParams,
  PalmyPools,
  tEthereumAddress,
  TokenContractId,
} from './types';
import PalmyConfig from '../markets/palmy';

export const deployUiIncentiveDataProviderV2 = async (verify?: boolean) =>
  withSaveAndVerify(
    await new UiIncentiveDataProviderV2Factory(await getFirstSigner()).deploy(),
    eContractid.UiIncentiveDataProviderV2,
    [],
    verify
  );

export const deployUiPoolDataProviderV2 = async (verify?: boolean) =>
  withSaveAndVerify(
    await new UiPoolDataProviderV2Factory(await getFirstSigner()).deploy(),
    eContractid.UiPoolDataProviderV2,
    [],
    verify
  );

const readArtifact = async (id: string) => {
  if (DRE.network.name === eEthereumNetwork.buidlerevm) {
    return buidlerReadArtifact(DRE.config.paths.artifacts, id);
  }
  return (DRE as HardhatRuntimeEnvironment).artifacts.readArtifact(id);
};

export const deployLendingPoolAddressesProvider = async (
  marketId: string,
  initialOwner: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new LendingPoolAddressesProviderFactory(await getFirstSigner()).deploy(
      marketId,
      initialOwner
    ),
    eContractid.LendingPoolAddressesProvider,
    [marketId, initialOwner],
    verify
  );

export const exportDeploymentCallData = async (id: eContractid) => {
  return await getDeploymentCallData(id);
};
export const deployLendingPoolAddressesProviderRegistry = async (
  initialOwner: string,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new LendingPoolAddressesProviderRegistryFactory(await getFirstSigner()).deploy(
      initialOwner
    ),
    eContractid.LendingPoolAddressesProviderRegistry,
    [initialOwner],
    verify
  );

const _getDeploymentCallData = async (contractName: string, args: any[]): Promise<BytesLike> => {
  const contract = (await DRE.ethers.getContractFactory(contractName)).getDeployTransaction(
    ...args
  );
  return contract.data!;
};

const getDeploymentCallData = async (contractName: eContractid): Promise<BytesLike> => {
  return await _getDeploymentCallData(
    contractName,
    await getDeployArgs(DRE.network.name as eNetwork, contractName)
  );
};

export const deployLendingPoolConfigurator = async (verify?: boolean) => {
  const lendingPoolConfiguratorImpl = await new LendingPoolConfiguratorFactory(
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.LendingPoolConfiguratorImpl,
    lendingPoolConfiguratorImpl.address
  );
  return withSaveAndVerify(
    lendingPoolConfiguratorImpl,
    eContractid.LendingPoolConfigurator,
    [],
    verify
  );
};

export const getDeployArgs = async (network: eNetwork, id: eContractid) => {
  const config = loadPoolConfig(ConfigNames.Palmy);
  const genesisAdmin = await getGenesisPoolAdmin(config);
  switch (id) {
    case eContractid.LendingPoolAddressesProvider:
      return [PalmyConfig.MarketId, genesisAdmin];
    case eContractid.LendingPoolAddressesProviderRegistry:
      return [genesisAdmin];
    case eContractid.StableAndVariableTokensHelper:
      return [genesisAdmin];
    case eContractid.LTokensAndRatesHelper:
      return [genesisAdmin];
    case eContractid.PriceAggregatorAdapterChainsightImpl:
      return [genesisAdmin];
    case eContractid.LendingRateOracle:
      return [genesisAdmin];
    case eContractid.PalmyFallbackOracle:
      return [genesisAdmin];
    case eContractid.PalmyOracle:
      return [
        await getQuoteCurrency(loadPoolConfig(ConfigNames.Palmy)),
        await loadPoolConfig(ConfigNames.Palmy).OracleQuoteUnit,
        genesisAdmin,
      ];
    case eContractid.WETHGateway:
      return [await getWrappedNativeTokenAddress(loadPoolConfig(ConfigNames.Palmy)), genesisAdmin];
    default:
      return [];
  }
};

export const deployReserveLogicLibrary = async (verify?: boolean) =>
  withSaveAndVerify(
    await new ReserveLogicFactory(await getFirstSigner()).deploy(),
    eContractid.ReserveLogic,
    [],
    verify
  );
export const exportGenericLogicDeploymentCallData = async (reserveLogicAddress: string) => {
  const genericLogicFactory = await getGenericLogicContractFactory(reserveLogicAddress);
  return await genericLogicFactory.connect(await getFirstSigner()).getDeployTransaction().data!;
};
const getGenericLogicContractFactory = async (reserveLogicAddress: string) => {
  const genericLogicArtifact = await readArtifact(eContractid.GenericLogic);

  const linkedGenericLogicByteCode = linkBytecode(genericLogicArtifact, {
    [eContractid.ReserveLogic]: reserveLogicAddress,
  });

  return await DRE.ethers.getContractFactory(genericLogicArtifact.abi, linkedGenericLogicByteCode);
};

export const deployGenericLogic = async (reserveLogic: Contract, verify?: boolean) => {
  const genericLogicFactory = await getGenericLogicContractFactory(reserveLogic.address);

  const genericLogic = await (
    await genericLogicFactory.connect(await getFirstSigner()).deploy()
  ).deployed();
  return withSaveAndVerify(genericLogic, eContractid.GenericLogic, [], verify);
};

export const exportValidationLogicDeploymentCallData = async (
  reserveLogicAddress: string,
  genericLogicAddress: string
) => {
  const validationLogicFactory = await getValidationLogicContractFactory(
    reserveLogicAddress,
    genericLogicAddress
  );
  return await validationLogicFactory.connect(await getFirstSigner()).getDeployTransaction().data!;
};

const getValidationLogicContractFactory = async (
  reserveLogicAddress: string,
  genericLogicAddress: string
) => {
  const validationLogicArtifact = await readArtifact(eContractid.ValidationLogic);

  const linkedValidationLogicByteCode = linkBytecode(validationLogicArtifact, {
    [eContractid.ReserveLogic]: reserveLogicAddress,
    [eContractid.GenericLogic]: genericLogicAddress,
  });

  return await DRE.ethers.getContractFactory(
    validationLogicArtifact.abi,
    linkedValidationLogicByteCode
  );
};

export const deployValidationLogic = async (
  reserveLogic: Contract,
  genericLogic: Contract,
  verify?: boolean
) => {
  const validationLogicFactory = await getValidationLogicContractFactory(
    reserveLogic.address,
    genericLogic.address
  );

  const validationLogic = await (
    await validationLogicFactory.connect(await getFirstSigner()).deploy()
  ).deployed();

  return withSaveAndVerify(validationLogic, eContractid.ValidationLogic, [], verify);
};

export const deployPalmyLibraries = async (
  verify?: boolean
): Promise<LendingPoolLibraryAddresses> => {
  const reserveLogic = await deployReserveLogicLibrary(verify);
  const genericLogic = await deployGenericLogic(reserveLogic, verify);
  const validationLogic = await deployValidationLogic(reserveLogic, genericLogic, verify);

  return toPalmyLibs(validationLogic.address, reserveLogic.address);
};

export const toPalmyLibs = async (
  validationLogicAddress: string,
  reserveLogicAddress: string
): Promise<LendingPoolLibraryAddresses> => {
  // Hardcoded solidity placeholders, if any library changes path this will fail.
  // The '__$PLACEHOLDER$__ can be calculated via solidity keccak, but the LendingPoolLibraryAddresses Type seems to
  // require a hardcoded string.
  //
  //  how-to:
  //  1. PLACEHOLDER = solidityKeccak256(['string'], `${libPath}:${libName}`).slice(2, 36)
  //  2. LIB_PLACEHOLDER = `__$${PLACEHOLDER}$__`
  // or grab placeholdes from LendingPoolLibraryAddresses at Typechain generation.
  //
  // libPath example: contracts/libraries/logic/GenericLogic.sol
  // libName example: GenericLogic
  return {
    ['__$22cd43a9dda9ce44e9b92ba393b88fb9ac$__']: reserveLogicAddress,
    ['__$de8c0cf1a7d7c36c802af9a64fb9d86036$__']: validationLogicAddress,
  };
};

export const exportLendingPoolCallData = async () => {
  const reserveLogicAddress = await getContractAddressWithJsonFallback(
    eContractid.ReserveLogic,
    ConfigNames.Palmy
  );
  const validationLogicAddress = await getContractAddressWithJsonFallback(
    eContractid.ValidationLogic,
    ConfigNames.Palmy
  );
  const libs = await toPalmyLibs(validationLogicAddress, reserveLogicAddress);
  const lendingPoolFactory = await new LendingPoolFactory(libs, await getFirstSigner());
  return await lendingPoolFactory.getDeployTransaction().data!;
};

export const deployLendingPool = async (verify?: boolean) => {
  const libraries = await deployPalmyLibraries(verify);
  const lendingPoolImpl = await new LendingPoolFactory(libraries, await getFirstSigner()).deploy();
  await insertContractAddressInDb(eContractid.LendingPoolImpl, lendingPoolImpl.address);
  return withSaveAndVerify(lendingPoolImpl, eContractid.LendingPool, [], verify);
};

export const deployPriceOracle = async (verify?: boolean) =>
  withSaveAndVerify(
    await new PriceOracleFactory(await getFirstSigner()).deploy(),
    eContractid.PriceOracle,
    [],
    verify
  );

export const deployPalmyFallbackOracle = async (initialOwner: string, verify?: boolean) =>
  withSaveAndVerify(
    await new PalmyFallbackOracleFactory(await getFirstSigner()).deploy(initialOwner),
    eContractid.PalmyFallbackOracle,
    [],
    verify
  );

export const deployLendingRateOracle = async (initialOwner: string, verify?: boolean) =>
  withSaveAndVerify(
    await new LendingRateOracleFactory(await getFirstSigner()).deploy(initialOwner),
    eContractid.LendingRateOracle,
    [],
    verify
  );

export const deployMockAggregator = async (
  args: [tEthereumAddress[], string[]],
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockAggregatorFactory(await getFirstSigner()).deploy(args[0], args[1]),
    eContractid.MockAggregator,
    args,
    verify
  );

export const deployPalmyOracle = async (args: [string, string, string], verify?: boolean) =>
  withSaveAndVerify(
    await new PalmyOracleFactory(await getFirstSigner()).deploy(args[0], args[1], args[2]),
    eContractid.PalmyOracle,
    args,
    verify
  );

export const deployLendingPoolCollateralManager = async (verify?: boolean) => {
  const collateralManagerImpl = await new LendingPoolCollateralManagerFactory(
    await getFirstSigner()
  ).deploy();
  await insertContractAddressInDb(
    eContractid.LendingPoolCollateralManagerImpl,
    collateralManagerImpl.address
  );
  return withSaveAndVerify(
    collateralManagerImpl,
    eContractid.LendingPoolCollateralManager,
    [],
    verify
  );
};

export const deployInitializableAdminUpgradeabilityProxy = async (verify?: boolean) =>
  withSaveAndVerify(
    await new InitializableAdminUpgradeabilityProxyFactory(await getFirstSigner()).deploy(),
    eContractid.InitializableAdminUpgradeabilityProxy,
    [],
    verify
  );

export const deployMockFlashLoanReceiver = async (
  addressesProvider: tEthereumAddress,
  verify?: boolean
) =>
  withSaveAndVerify(
    await new MockFlashLoanReceiverFactory(await getFirstSigner()).deploy(addressesProvider),
    eContractid.MockFlashLoanReceiver,
    [addressesProvider],
    verify
  );

export const deployWalletBalancerProvider = async (verify?: boolean) =>
  withSaveAndVerify(
    await new WalletBalanceProviderFactory(await getFirstSigner()).deploy(),
    eContractid.WalletBalanceProvider,
    [],
    verify
  );

export const deployPalmyProtocolDataProvider = async (verify?: boolean) =>
  withSaveAndVerify(
    await new PalmyProtocolDataProviderFactory(await getFirstSigner()).deploy(),
    eContractid.PalmyProtocolDataProvider,
    [],
    verify
  );

export const deployMintableERC20 = async (
  args: [string, string, string],
  verify?: boolean
): Promise<MintableERC20> =>
  withSaveAndVerify(
    await new MintableERC20Factory(await getFirstSigner()).deploy(...args),
    eContractid.MintableERC20,
    args,
    verify
  );

export const deployMintableDelegationERC20 = async (
  args: [string, string, string],
  verify?: boolean
): Promise<MintableDelegationERC20> =>
  withSaveAndVerify(
    await new MintableDelegationERC20Factory(await getFirstSigner()).deploy(...args),
    eContractid.MintableDelegationERC20,
    args,
    verify
  );
export const deployDefaultReserveInterestRateStrategy = async (
  args: [tEthereumAddress, string, string, string, string, string, string],
  verify: boolean
) =>
  withSaveAndVerify(
    await new DefaultReserveInterestRateStrategyFactory(await getFirstSigner()).deploy(...args),
    eContractid.DefaultReserveInterestRateStrategy,
    args,
    verify
  );

export const deployStableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string],
  verify: boolean
) => {
  const instance = await withSaveAndVerify(
    await new StableDebtTokenFactory(await getFirstSigner()).deploy(),
    eContractid.StableDebtToken,
    [],
    verify
  );

  await instance.initialize(args[0], args[1], args[2], '18', args[3], args[4], '0x10');

  return instance;
};

export const deployVariableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string],
  verify: boolean
) => {
  const instance = await withSaveAndVerify(
    await new VariableDebtTokenFactory(await getFirstSigner()).deploy(),
    eContractid.VariableDebtToken,
    [],
    verify
  );

  await instance.initialize(args[0], args[1], args[2], '18', args[3], args[4], '0x10');

  return instance;
};
export const deployChainsightOracle = async (symbol: string, verify: boolean) => {
  withSaveAndVerify(
    await new ChainsightOracleFactory(await getFirstSigner()).deploy(),
    `${eContractid.ChainsightOracle}${symbol}`,
    [],
    verify
  );
};

export const deployGenericStableDebtToken = async (verify?: boolean) =>
  withSaveAndVerify(
    await new StableDebtTokenFactory(await getFirstSigner()).deploy(),
    eContractid.StableDebtToken,
    [],
    verify
  );

export const deployGenericVariableDebtToken = async (verify?: boolean) =>
  withSaveAndVerify(
    await new VariableDebtTokenFactory(await getFirstSigner()).deploy(),
    eContractid.VariableDebtToken,
    [],
    verify
  );

export const deployGenericLToken = async (
  [poolAddress, underlyingAssetAddress, treasuryAddress, incentivesController, name, symbol]: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string
  ],
  verify: boolean
) => {
  const instance = await withSaveAndVerify(
    await new LTokenFactory(await getFirstSigner()).deploy(),
    eContractid.LToken,
    [],
    verify
  );

  await instance.initialize(
    poolAddress,
    treasuryAddress,
    underlyingAssetAddress,
    incentivesController,
    '18',
    name,
    symbol,
    '0x10'
  );

  return instance;
};

export const deployGenericLTokenImpl = async (verify: boolean) =>
  withSaveAndVerify(
    await new LTokenFactory(await getFirstSigner()).deploy(),
    eContractid.LToken,
    [],
    verify
  );

export const deployDelegationAwareLToken = async (
  [pool, underlyingAssetAddress, treasuryAddress, incentivesController, name, symbol]: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string
  ],
  verify: boolean
) => {
  const instance = await withSaveAndVerify(
    await new DelegationAwareLTokenFactory(await getFirstSigner()).deploy(),
    eContractid.DelegationAwareLToken,
    [],
    verify
  );

  await instance.initialize(
    pool,
    treasuryAddress,
    underlyingAssetAddress,
    incentivesController,
    '18',
    name,
    symbol,
    '0x10'
  );

  return instance;
};

export const deployDelegationAwareLTokenImpl = async (verify: boolean) =>
  withSaveAndVerify(
    await new DelegationAwareLTokenFactory(await getFirstSigner()).deploy(),
    eContractid.DelegationAwareLToken,
    [],
    verify
  );

export const deployAllMockTokens = async (verify?: boolean) => {
  const tokens: { [symbol: string]: MintableERC20 | WETH9Mocked } = {};

  const protoConfigData = getReservesConfigByPool(PalmyPools.proto);

  for (const tokenSymbol of Object.values(TokenContractId)) {
    if (tokenSymbol === 'WOAS') {
      tokens[tokenSymbol] = await deployWETHMocked();
      await registerContractInJsonDb(tokenSymbol.toUpperCase(), tokens[tokenSymbol]);
      continue;
    }
    let decimals = '18';

    let configData = (<any>protoConfigData)[tokenSymbol];

    tokens[tokenSymbol] = await deployMintableERC20(
      [tokenSymbol, tokenSymbol, configData ? configData.reserveDecimals : decimals],
      verify
    );
    await registerContractInJsonDb(tokenSymbol.toUpperCase(), tokens[tokenSymbol]);
  }
  return tokens;
};

export const deployStableAndVariableTokensHelper = async (initialOwner: string, verify?: boolean) =>
  withSaveAndVerify(
    await new StableAndVariableTokensHelperFactory(await getFirstSigner()).deploy(initialOwner),
    eContractid.StableAndVariableTokensHelper,
    [],
    verify
  );

export const deployLTokensAndRatesHelper = async (initialOwner: string, verify?: boolean) =>
  withSaveAndVerify(
    await new LTokensAndRatesHelperFactory(await getFirstSigner()).deploy(initialOwner),
    eContractid.LTokensAndRatesHelper,
    [],
    verify
  );

export const deployWETHGateway = async (args: [tEthereumAddress, string], verify?: boolean) =>
  withSaveAndVerify(
    await new WETHGatewayFactory(await getFirstSigner()).deploy(...args),
    eContractid.WETHGateway,
    args,
    verify
  );

export const authorizeWETHGateway = async (
  wethGateWay: tEthereumAddress,
  lendingPool: tEthereumAddress
) =>
  await new WETHGatewayFactory(await getFirstSigner())
    .attach(wethGateWay)
    .authorizeLendingPool(lendingPool);

export const deployMockStableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string, string],
  verify?: boolean
) => {
  const instance = await withSaveAndVerify(
    await new MockStableDebtTokenFactory(await getFirstSigner()).deploy(),
    eContractid.MockStableDebtToken,
    [],
    verify
  );

  await instance.initialize(args[0], args[1], args[2], '18', args[3], args[4], args[5]);

  return instance;
};

export const deployWETHMocked = async (verify?: boolean) =>
  withSaveAndVerify(
    await new WETH9MockedFactory(await getFirstSigner()).deploy(),
    eContractid.WOASMocked,
    [],
    verify
  );

export const deployMockVariableDebtToken = async (
  args: [tEthereumAddress, tEthereumAddress, tEthereumAddress, string, string, string],
  verify?: boolean
) => {
  const instance = await withSaveAndVerify(
    await new MockVariableDebtTokenFactory(await getFirstSigner()).deploy(),
    eContractid.MockVariableDebtToken,
    [],
    verify
  );

  await instance.initialize(args[0], args[1], args[2], '18', args[3], args[4], args[5]);

  return instance;
};

export const deployMockLToken = async (
  args: [
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    tEthereumAddress,
    string,
    string,
    string
  ],
  verify?: boolean
) => {
  const instance = await withSaveAndVerify(
    await new MockLTokenFactory(await getFirstSigner()).deploy(),
    eContractid.MockLToken,
    [],
    verify
  );

  await instance.initialize(args[0], args[2], args[1], args[3], '18', args[4], args[5], args[6]);

  return instance;
};

export const deploySelfdestructTransferMock = async (verify?: boolean) =>
  withSaveAndVerify(
    await new SelfdestructTransferFactory(await getFirstSigner()).deploy(),
    eContractid.SelfdestructTransferMock,
    [],
    verify
  );

export const chooseLTokenDeployment = (id: eContractid) => {
  switch (id) {
    case eContractid.LToken:
      return deployGenericLTokenImpl; // use Rev1
    case eContractid.DelegationAwareLToken:
      return deployDelegationAwareLTokenImpl;
    default:
      throw Error(`Missing lToken implementation deployment script for: ${id}`);
  }
};

export const deployLTokenImplementations = async (
  pool: ConfigNames,
  reservesConfig: { [key: string]: IReserveParams },
  verify = false
) => {
  const poolConfig = loadPoolConfig(pool);
  const network = <eNetwork>DRE.network.name;

  // Obtain the different LToken implementations of all reserves inside the Market config
  const lTokenImplementations = [
    ...Object.entries(reservesConfig).reduce<Set<eContractid>>((acc, [, entry]) => {
      acc.add(entry.lTokenImpl);
      return acc;
    }, new Set<eContractid>()),
  ];

  for (let x = 0; x < lTokenImplementations.length; x++) {
    const lTokenAddress = getOptionalParamAddressPerNetwork(
      poolConfig[lTokenImplementations[x].toString()],
      network
    );
    if (!notFalsyOrZeroAddress(lTokenAddress)) {
      const deployImplementationMethod = chooseLTokenDeployment(lTokenImplementations[x]);
      console.log(`Deploying implementation`, lTokenImplementations[x]);
      await deployImplementationMethod(verify);
    }
  }
  await deployGenericStableDebtToken(verify);

  await deployGenericVariableDebtToken(verify);
};

export const deployRateStrategy = async (
  strategyName: string,
  args: [tEthereumAddress, string, string, string, string, string, string],
  verify: boolean
): Promise<tEthereumAddress> => {
  switch (strategyName) {
    default:
      return await (
        await deployDefaultReserveInterestRateStrategy(args, verify)
      ).address;
  }
};

export const deployPriceAggregatorChainsightImpl = async (initialOwner: string, verify?: boolean) =>
  withSaveAndVerify(
    await new PriceAggregatorAdapterChainsightImplFactory(await getFirstSigner()).deploy(
      initialOwner
    ),
    eContractid.PriceAggregatorAdapterChainsightImpl,
    [],
    verify
  );

export const deployStakeUIHelper = async (verify?: boolean) => {
  return withSaveAndVerify(
    await new StakeUIHelperFactory(await getFirstSigner()).deploy(),
    eContractid.StakeUIHelper,
    [],
    verify
  );
};
