import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@tenderly/hardhat-tenderly';
import fs from 'fs';
import 'hardhat-gas-reporter';
import 'hardhat-typechain';
import { HardhatUserConfig } from 'hardhat/types';
import path from 'path';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';
import { buildForkConfig, NETWORKS_DEFAULT_GAS, NETWORKS_RPC_URL } from './helper-hardhat-config';
import { BUIDLEREVM_CHAINID, COVERAGE_CHAINID } from './helpers/buidler-constants';
import { eOasysNetwork, eNetwork } from './helpers/types';
// @ts-ignore
import { accounts } from './test-wallets.js';

require('dotenv').config();

const SKIP_LOAD = process.env.SKIP_LOAD === 'true';
const DEFAULT_BLOCK_GAS_LIMIT = 8000000;
const DEFAULT_GAS_MUL = 5;
const HARDFORK = 'istanbul';
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY || '';
const MNEMONIC_PATH = "m/44'/60'/0'/0";
const MNEMONIC = process.env.MNEMONIC || '';
const UNLIMITED_BYTECODE_SIZE = process.env.UNLIMITED_BYTECODE_SIZE === 'true';

// Prevent to load scripts before compilation and typechain
if (!SKIP_LOAD) {
  [
    'misc',
    'migrations',
    'dev',
    'full',
    'verifications',
    'deployments',
    'helpers',
    'operations',
    'initializations',
  ].forEach((folder) => {
    const tasksPath = path.join(__dirname, 'tasks', folder);
    fs.readdirSync(tasksPath)
      .filter((pth) => pth.includes('.ts'))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });
}

require(`${path.join(__dirname, 'tasks/misc')}/set-bre.ts`);

const getCommonNetworkConfig = (networkName: eNetwork, networkId: number) => ({
  url: NETWORKS_RPC_URL[networkName],
  hardfork: HARDFORK,
  chainId: networkId,
  accounts: {
    mnemonic: MNEMONIC,
    path: MNEMONIC_PATH,
    initialIndex: 0,
    count: 20,
  },
});

let forkMode;

const buidlerConfig: HardhatUserConfig = {
  solidity: {
    version: '0.6.12',
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: 'istanbul',
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  etherscan: {
    apiKey: {
      testnet: 'N/A',
      oasys: 'N/A',
    },
    customChains: [
      {
        chainId: 9372,
        network: 'testnet',
        urls: {
          apiURL: 'https://explorer.testnet.oasys.games/api',
          browserURL: 'https://explorer.testnet.oasys.games',
        },
      },
      {
        chainId: 248,
        network: 'oasys',
        urls: {
          apiURL: 'https://explorer.oasys.games/api',
          browserURL: 'https://explorer.oasys.games',
        },
      },
    ],
  },
  mocha: {
    timeout: 0,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT || '',
    username: process.env.TENDERLY_USERNAME || '',
    forkNetwork: '1', //Network id of the network we want to fork
  },
  networks: {
    coverage: {
      url: 'http://localhost:8555',
      chainId: COVERAGE_CHAINID,
    },
    testnet: getCommonNetworkConfig(eOasysNetwork.testnet, 9372),
    oasys: getCommonNetworkConfig(eOasysNetwork.oasys, 248),
    hardhat: {
      hardfork: 'berlin',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: DEFAULT_BLOCK_GAS_LIMIT,
      gasPrice: 8000000000,
      allowUnlimitedContractSize: UNLIMITED_BYTECODE_SIZE,
      chainId: BUIDLEREVM_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      accounts: accounts.map(({ secretKey, balance }: { secretKey: string; balance: string }) => ({
        privateKey: secretKey,
        balance,
      })),
      forking: buildForkConfig(),
    },
    buidlerevm_docker: {
      hardfork: 'berlin',
      blockGasLimit: 9500000,
      gas: 9500000,
      gasPrice: 8000000000,
      chainId: BUIDLEREVM_CHAINID,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      url: 'http://localhost:8545',
    },
    ganache: {
      url: 'http://ganache:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 20,
      },
    },
  },
};

export default buidlerConfig;
