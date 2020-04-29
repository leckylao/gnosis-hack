require('dotenv').config();
const mnemonic = process.env.MNEMONIC;
const HDWalletProvider = require('@truffle/hdwallet-provider');
// Create your own key for Production environments (https://infura.io/)
const INFURA_ID = process.env.INFURA_ID || 'd6760e62b67f4937ba1ea2691046f06d';


const configNetwork = (network, networkId, path = "m/44'/60'/0'/0/", gas = 4465030, gasPrice = 0.3e10) => ({
  provider: () => new HDWalletProvider(
    mnemonic, `https://${network}.infura.io/v3/${INFURA_ID}`,
        0, 1, true, path
    ),
  network_id: networkId,
  gas,
  gasPrice,
});

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    main: configNetwork('mainnet', 1, "m/44'/60'/0'/0/1'"),
    kovan: configNetwork('kovan', 42),
    ropsten: configNetwork('ropsten', 3),
    rinkeby: configNetwork('rinkeby', 4),
    goerli: configNetwork('goerli', 5),
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // enableTimeouts: false,
    // before_timeout: 60000 // Here is 2min but can be whatever timeout is suitable for you.
    timeout: 100000
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.17",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
       optimizer: {
         enabled: true,
         runs: 200
       },
       // evmVersion: "byzantium"
      }
    }
  }
}
