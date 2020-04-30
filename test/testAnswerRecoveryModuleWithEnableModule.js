const { accounts, contract } = require('@openzeppelin/test-environment');
const [ owner ] = accounts;

describe('AnswerRecoveryModule', function () {
  const Web3 = require('web3');
  const web3 = new Web3();
  const utils = require('@gnosis.pm/safe-contracts/test/utils/general');
  const GnosisSafe = artifacts.require("./GnosisSafe.sol");
  const ProxyFactory = artifacts.require("./GnosisSafeProxyFactory.sol");
  const AnswerRecoveryModule = artifacts.require("AnswerRecoveryModule");

  // const GnosisSafe = contract.fromArtifact("GnosisSafe");
  // const ProxyFactory = contract.fromArtifact("GnosisSafeProxyFactory");
  // const AnswerRecoveryModule = contract.fromArtifact("AnswerRecoveryModule");

  let gnosisSafe;
  let answerRecoveryModule;
  let answer = "toyota;dog;sydney";
  answer = web3.utils.keccak256(answer);
  let modules;

  beforeEach(async function () {
    // Create Master Copies
    let proxyFactory = await ProxyFactory.new();
    let gnosisSafeMasterCopy = await utils.deployContract("deploying Gnosis Safe Mastercopy", GnosisSafe);
    let answerRecoveryModuleMasterCopy = await utils.deployContract("deploying AnswerRecoveryModule", AnswerRecoveryModule);
    // Create lightwallet
    let lw = await utils.createLightwallet();
    const CALL = 0;

    // Create Gnosis Safe
    const setupData = await gnosisSafeMasterCopy.contract.methods.setup(
      [lw.accounts[0], lw.accounts[1]], 2, utils.Address0, "0x", utils.Address0, utils.Address0, 0, utils.Address0).encodeABI();
    gnosisSafe = await utils.getParamFromTxEvent(
      await proxyFactory.createProxy(gnosisSafeMasterCopy.address, setupData),
      'ProxyCreation', 'proxy', proxyFactory.address, GnosisSafe, 'create Gnosis Safe'
    )

    let execTransaction = async function(safe, to, value, data, operation, message) {
      let nonce = await safe.nonce()
      let transactionHash = await safe.getTransactionHash(to, value, data, operation, 0, 0, 0, utils.Address0, utils.Address0, nonce)
      let sigs = utils.signTransaction(lw, [lw.accounts[0], lw.accounts[1]], transactionHash)
      utils.logGasUsage(
        'execTransaction ' + message,
        await safe.execTransaction(to, value, data, operation, 0, 0, 0, utils.Address0, utils.Address0, sigs)
      )
    }

    // Enable module
    const enableModuleData = await gnosisSafeMasterCopy.contract.methods.enableModule(answerRecoveryModuleMasterCopy.address).encodeABI();
    await execTransaction(gnosisSafe, gnosisSafe.address, 0, enableModuleData, CALL, "enable module");

    // Setup module
    let moduleData = await answerRecoveryModuleMasterCopy.contract.methods.setup().encodeABI();
    await execTransaction(gnosisSafe, answerRecoveryModuleMasterCopy.address, 0, moduleData, CALL, "setup module")

    // Enable Recovery
    let enableRecoveryData = await answerRecoveryModuleMasterCopy.contract.methods.enableRecovery(answer).encodeABI();
    await execTransaction(gnosisSafe, answerRecoveryModuleMasterCopy.address, 0, enableRecoveryData, CALL, "Enable Recovery")

    modules = await gnosisSafe.getModules();
    answerRecoveryModule = await AnswerRecoveryModule.at(modules[0]);
    assert.equal(await answerRecoveryModule.manager.call(), gnosisSafe.address);
  });

  it('can not recover by wrong answer', async function() {
    utils.assertRejects(answerRecoveryModule.recoverAccess("wrong answer", accounts[9]), 'Wrong answer!')
    assert.equal(await gnosisSafe.isOwner(accounts[9]), false);
  });

  it('can recover by correct answer with new owner', async function() {
    utils.logGasUsage("recover access", await answerRecoveryModule.recoverAccess(answer, accounts[9]));
    assert.equal(await gnosisSafe.isOwner(accounts[9]), true);
  });

});
