import { Artifact as BuidlerArtifact } from '@nomiclabs/buidler/types';
import BigNumber from 'bignumber.js';
import { signTypedData_v4 } from 'eth-sig-util';
import { ECDSASignature, fromRpcSig } from 'ethereumjs-util';
import { BigNumberish, BytesLike, Contract, ethers, Signer, utils } from 'ethers';
import { Artifact } from 'hardhat/types';
import { MintableERC20 } from '../types/MintableERC20';
import { ConfigNames, loadPoolConfig } from './configuration';
import { PERMISSIONED_CONTRACT_FACTORY_ADDRESS, ZERO_ADDRESS } from './constants';
import { getFirstSigner, getIErc20Detailed } from './contracts-getters';
import { verifyEtherscanContract } from './etherscan-verification';
import { DRE, getDb, notFalsyOrZeroAddress, waitForTx } from './misc-utils';
import {
  eOasysNetwork,
  eContractid,
  eEthereumNetwork,
  eNetwork,
  iOasysParamsPerNetwork,
  iEthereumParamsPerNetwork,
  iParamsPerNetwork,
  iParamsPerPool,
  PalmyPools,
  tEthereumAddress,
  tStringTokenSmallUnits,
} from './types';
import { IPermissionedContractFactoryFactory } from '../types/IPermissionedContractFactoryFactory';

export const getOasysDeploymentAddress = async (contractId: string, callData: BytesLike) => {
  // Calculate the length of calldata in hex, padding to 64 characters
  const instance = IPermissionedContractFactoryFactory.connect(
    PERMISSIONED_CONTRACT_FACTORY_ADDRESS,
    DRE.ethers.provider
  );
  return await instance.getDeploymentAddress(callData, toSalt(contractId));
};

const toSalt = (contractId: string) => {
  return utils.hexlify(utils.sha256(utils.toUtf8Bytes(contractId + 'palmy-fi')));
};

export const deployToOasysTestnet = async (id: eContractid, verify?: boolean) => {
  const path = require('path');
  const fs = require('fs');
  const dir = path.join(__dirname, '..', '.deployments', 'calldata', 'testnet');
  const file = path.join(dir, `${id}.calldata`);
  if (!fs.existsSync(file)) {
    throw new Error(`File ${file} not found`);
  }
  const calldata = fs.readFileSync(file, 'utf8');
  const signer = (await getEthersSigners())[0];
  const tx = await signer.sendTransaction({
    data: calldata,
    to: undefined,
    type: 2,
  });
  const receipt = await tx.wait();
  await registerContractAddressInJsonDb(id, receipt.contractAddress!, receipt.from);
  console.log(
    `\t ${id} deployed tx: ${receipt.transactionHash}, address: ${receipt.contractAddress}`
  );
  return receipt;
};
export const registerContractAddressInJsonDb = async (
  contractId: string,
  address: string,
  deployer: string
) => {
  const currentNetwork = DRE.network.name;
  await getDb()
    .set(`${contractId}.${currentNetwork}`, {
      address: address,
      deployer: deployer,
    })
    .write();
};
export type MockTokenMap = { [symbol: string]: MintableERC20 };
export const saveDeploymentCallData = async (contractId: string, callData: BytesLike) => {
  const currentNetwork = DRE.network.name;
  // save calldata into .deployments/calldata/<network>/<contractId>.calldata
  // directory of this file
  const path = require('path');
  const fs = require('fs');
  const dir = path.join(__dirname, '..', '.deployments', 'calldata', currentNetwork);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fileName = path.join(dir, `${contractId}.calldata`);
  fs.writeFileSync(fileName, callData);
  if ((currentNetwork as eNetwork) == eOasysNetwork.oasys) {
    await registerContractAddressAndSaltInJsonDb(
      contractId,
      await getOasysDeploymentAddress(contractId, callData),
      '',
      toSalt(contractId)
    );
  }
};

const registerContractAddressAndSaltInJsonDb = async (
  contractId: string,
  address: string,
  deployer: string,
  salt: string
) => {
  const currentNetwork = DRE.network.name;
  await getDb()
    .set(`${contractId}.${currentNetwork}`, {
      address: address,
      deployer: deployer,
      salt: salt,
    })
    .write();
};
export const registerContractInJsonDb = async (contractId: string, contractInstance: Contract) => {
  const currentNetwork = DRE.network.name;
  const FORK = process.env.FORK;
  if (FORK || (currentNetwork !== 'hardhat' && !currentNetwork.includes('coverage'))) {
    console.log(`*** ${contractId} ***\n`);
    console.log(`Network: ${currentNetwork}`);
    console.log(`tx: ${contractInstance.deployTransaction.hash}`);
    console.log(`contract address: ${contractInstance.address}`);
    console.log(`deployer address: ${contractInstance.deployTransaction.from}`);
    console.log(`gas price: ${contractInstance.deployTransaction.gasPrice}`);
    console.log(`gas used: ${contractInstance.deployTransaction.gasLimit}`);
    console.log(`\n******`);
    console.log();
  }

  await getDb()
    .set(`${contractId}.${currentNetwork}`, {
      address: contractInstance.address,
      deployer: contractInstance.deployTransaction.from,
    })
    .write();
};

export const insertContractAddressInDb = async (id: eContractid, address: tEthereumAddress) =>
  await getDb()
    .set(`${id}.${DRE.network.name}`, {
      address,
    })
    .write();

export const rawInsertContractAddressInDb = async (id: string, address: tEthereumAddress) =>
  await getDb()
    .set(`${id}.${DRE.network.name}`, {
      address,
    })
    .write();

export const getEthersSigners = async (): Promise<Signer[]> => {
  const ethersSigners = await Promise.all(await DRE.ethers.getSigners());
  // if (usingDefender()) {
  //   const [, ...users] = ethersSigners;
  //   return [await getDefenderRelaySigner(), ...users];
  // }
  return ethersSigners;
};

export const getEthersSignersAddresses = async (): Promise<tEthereumAddress[]> =>
  await Promise.all((await getEthersSigners()).map((signer) => signer.getAddress()));

export const getCurrentBlock = async () => {
  return DRE.ethers.provider.getBlockNumber();
};

export const decodeAbiNumber = (data: string): number =>
  parseInt(utils.defaultAbiCoder.decode(['uint256'], data).toString());

export const deployContract = async <ContractType extends Contract>(
  contractName: string,
  args: any[]
): Promise<ContractType> => {
  const contract = (await (await DRE.ethers.getContractFactory(contractName))
    .connect(await getFirstSigner())
    .deploy(...args)) as ContractType;
  await waitForTx(contract.deployTransaction);
  await registerContractInJsonDb(<eContractid>contractName, contract);
  return contract;
};

export const withSaveAndVerify = async <ContractType extends Contract>(
  instance: ContractType,
  id: string,
  args: (string | string[])[],
  verify?: boolean
): Promise<ContractType> => {
  await waitForTx(instance.deployTransaction);
  await registerContractInJsonDb(id, instance);
  if (verify) {
    await verifyContract(id, instance.address, args);
  }
  return instance;
};

export const getContract = async <ContractType extends Contract>(
  contractName: string,
  address: string
): Promise<ContractType> => (await DRE.ethers.getContractAt(contractName, address)) as ContractType;

export const linkBytecode = (artifact: BuidlerArtifact | Artifact, libraries: any) => {
  let bytecode = artifact.bytecode;

  for (const [fileName, fileReferences] of Object.entries(artifact.linkReferences)) {
    for (const [libName, fixups] of Object.entries(fileReferences)) {
      const addr = libraries[libName];

      if (addr === undefined) {
        continue;
      }

      for (const fixup of fixups) {
        bytecode =
          bytecode.substr(0, 2 + fixup.start * 2) +
          addr.substr(2) +
          bytecode.substr(2 + (fixup.start + fixup.length) * 2);
      }
    }
  }

  return bytecode;
};

export const getParamPerNetwork = <T>(param: iParamsPerNetwork<T>, network: eNetwork) => {
  const { coverage, buidlerevm, tenderly } = param as iEthereumParamsPerNetwork<T>;
  const { testnet, oasys } = param as iOasysParamsPerNetwork<T>;
  if (process.env.FORK) {
    return param[process.env.FORK as eNetwork] as T;
  }

  switch (network) {
    case eEthereumNetwork.coverage:
      return coverage;
    case eEthereumNetwork.buidlerevm:
      return buidlerevm;
    case eEthereumNetwork.hardhat:
      return buidlerevm;
    case eEthereumNetwork.tenderly:
      return tenderly;
    case eOasysNetwork.testnet:
      return testnet;
    case eOasysNetwork.oasys:
      return oasys;
  }
};

export const getOptionalParamAddressPerNetwork = (
  param: iParamsPerNetwork<tEthereumAddress> | undefined | null,
  network: eNetwork
) => {
  if (!param) {
    return ZERO_ADDRESS;
  }
  return getParamPerNetwork(param, network);
};

export const getParamPerPool = <T>({ proto }: iParamsPerPool<T>, pool: PalmyPools) => {
  switch (pool) {
    case PalmyPools.proto:
      return proto;
    default:
      return proto;
  }
};

export const convertToCurrencyDecimals = async (tokenAddress: tEthereumAddress, amount: string) => {
  const token = await getIErc20Detailed(tokenAddress);
  let decimals = (await token.decimals()).toString();

  return ethers.utils.parseUnits(amount, decimals);
};

export const convertToCurrencyUnits = async (tokenAddress: string, amount: string) => {
  const token = await getIErc20Detailed(tokenAddress);
  let decimals = new BigNumber(await token.decimals());
  const currencyUnit = new BigNumber(10).pow(decimals);
  const amountInCurrencyUnits = new BigNumber(amount).div(currencyUnit);
  return amountInCurrencyUnits.toFixed();
};

export const buildPermitParams = (
  chainId: number,
  token: tEthereumAddress,
  revision: string,
  tokenName: string,
  owner: tEthereumAddress,
  spender: tEthereumAddress,
  nonce: number,
  deadline: string,
  value: tStringTokenSmallUnits
) => ({
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
  },
  primaryType: 'Permit' as const,
  domain: {
    name: tokenName,
    version: revision,
    chainId: chainId,
    verifyingContract: token,
  },
  message: {
    owner,
    spender,
    value,
    nonce,
    deadline,
  },
});

export const getSignatureFromTypedData = (
  privateKey: string,
  typedData: any // TODO: should be TypedData, from eth-sig-utils, but TS doesn't accept it
): ECDSASignature => {
  const signature = signTypedData_v4(Buffer.from(privateKey.substring(2, 66), 'hex'), {
    data: typedData,
  });
  return fromRpcSig(signature);
};

export const buildLiquiditySwapParams = (
  assetToSwapToList: tEthereumAddress[],
  minAmountsToReceive: BigNumberish[],
  swapAllBalances: BigNumberish[],
  permitAmounts: BigNumberish[],
  deadlines: BigNumberish[],
  v: BigNumberish[],
  r: (string | Buffer)[],
  s: (string | Buffer)[],
  useEthPath: boolean[]
) => {
  return ethers.utils.defaultAbiCoder.encode(
    [
      'address[]',
      'uint256[]',
      'bool[]',
      'uint256[]',
      'uint256[]',
      'uint8[]',
      'bytes32[]',
      'bytes32[]',
      'bool[]',
    ],
    [
      assetToSwapToList,
      minAmountsToReceive,
      swapAllBalances,
      permitAmounts,
      deadlines,
      v,
      r,
      s,
      useEthPath,
    ]
  );
};

export const buildRepayAdapterParams = (
  collateralAsset: tEthereumAddress,
  collateralAmount: BigNumberish,
  rateMode: BigNumberish,
  permitAmount: BigNumberish,
  deadline: BigNumberish,
  v: BigNumberish,
  r: string | Buffer,
  s: string | Buffer,
  useEthPath: boolean
) => {
  return ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint8', 'bytes32', 'bytes32', 'bool'],
    [collateralAsset, collateralAmount, rateMode, permitAmount, deadline, v, r, s, useEthPath]
  );
};

export const verifyContract = async (
  id: string,
  contractAddress: string,
  args: (string | string[])[],
  libraries?: string
) => {
  await verifyEtherscanContract(contractAddress, args, libraries);
};

export const getContractAddressWithJsonFallback = async (
  id: string,
  pool: ConfigNames
): Promise<tEthereumAddress> => {
  const poolConfig = loadPoolConfig(pool);
  const network = <eNetwork>DRE.network.name;
  const db = getDb();

  const contractAtMarketConfig = getOptionalParamAddressPerNetwork(poolConfig[id], network);
  if (notFalsyOrZeroAddress(contractAtMarketConfig)) {
    return contractAtMarketConfig;
  }

  const contractAtDb = await getDb().get(`${id}.${DRE.network.name}`).value();
  if (contractAtDb?.address) {
    return contractAtDb.address as tEthereumAddress;
  }
  throw Error(`Missing contract address ${id} at Market config and JSON local db`);
};
