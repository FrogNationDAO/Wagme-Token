import 'dotenv/config'
import 'tsconfig-paths/register'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import 'hardhat-deploy'
import 'hardhat-watcher'
import 'hardhat-gas-reporter'
import 'solidity-coverage'
import {HardhatUserConfig, task} from 'hardhat/config'

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

const accounts = {
  mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
      tags: ['local'],
    },
    ganache: {
      url: 'http://127.0.0.1:7545',
      tags: ['local'],
    },
    fantom: {
      url: 'https://rpc.ftm.tools',
      chainId: 250,
      accounts: accounts,
      tags: ['mainnet'],
    },
    fantomTestnet: {
      url: 'https://rpc.testnet.fantom.network',
      chainId: 0xFA2,
      accounts: accounts,
      tags: ['testnet'],
    },
  },
  namedAccounts: {
    deployer: 0,
    alice: 1,
    bob: 2,
    carol: 3,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: 'src/types',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false, // should overloads with full signatures like deposit(uint256) be generated always, even if there are no overloads?
    externalArtifacts: ['externalArtifacts/*.json'], // optional array of glob patterns with external artifacts to process (for example external libs from node_modules)
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    currency: 'USD',
  },
  watcher: {
    compile: {
      tasks: ['compile'],
      files: ['./contracts'],
      verbose: true,
    },
    test: {
      tasks: [{command: 'test', params: {testFiles: ['{path}']}}],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
}

export default config
