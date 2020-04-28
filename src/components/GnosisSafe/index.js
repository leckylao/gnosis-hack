import React, { useState } from 'react';
import { Flash, Box, Text, Heading, EthAddress, Card, Button } from "rimble-ui";
import CPK from 'contract-proxy-kit';
import gnosisSafe from '../../abis/GnosisSafe.json';
import answerRecoveryModule from '../../abis/AnswerRecoveryModule.json';
import LoadSafeModal from '../Modals/LoadSafeModal.js';
import FundSafeModal from '../Modals/FundSafeModal.js';

export default function GnosisSafe(props){
  const { web3, notify, account } = props;
  const [cpk, setCpk] = useState(undefined);
  const [modules, setModules] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");

  const answerRecoveryModuleMasterCopy = "0x4525AaAf8921AFF4cF364A5053187AcBcdF0572E";

  let createSafe = async () => {
    CPK.create({web3}).then(cpk => {
      getIsOwner(cpk);
      setCpk(cpk);
      getBalance(cpk);
    })
  };

  let loadSafe = async (e) => {
    e.preventDefault();
    CPK.load({web3}, safeAddress).then(cpk => {
      getIsOwner(cpk);
      setCpk(cpk);
      getBalance(cpk);
    })
  };

  let getIsOwner = async (cpk) => {
    let gnosisSafeContract = new web3.eth.Contract(gnosisSafe, cpk.address);
    let isOwner = await gnosisSafeContract.methods.isOwner(account).call();
    setIsOwner(isOwner);
  }

  let getModules = async (cpk, balance) => {
    if( balance === 0 )
      return;
    let gnosisSafeContract = new web3.eth.Contract(gnosisSafe, cpk.address);
    let modules = await gnosisSafeContract.methods.getModules().call();
    setModules(modules);
  }

  let getBalance = async (cpk) => {
    let balance = await web3.eth.getBalance(cpk.address);
    setBalance(balance);
    getModules(cpk, balance);
  };

  let enableRecovery = async () => {
    let gnosisSafeContract = new web3.eth.Contract(gnosisSafe, cpk.masterCopyAddress);
    let answerRecoveryModuleContract = new web3.eth.Contract(answerRecoveryModule, answerRecoveryModuleMasterCopy);
    let enableModuleData = await gnosisSafeContract.methods.enableModule(answerRecoveryModuleMasterCopy).encodeABI();
    let answer = "toyota;dog;sydney";
    answer = web3.utils.keccak256(answer);
    let setupData = await answerRecoveryModuleContract.methods.setup(answer).encodeABI();
    const Address1 = "0x".padEnd(41, '0') + "1"
    // let disableModuleData = await gnosisSafeContract.methods.disableModule(Address1, modules[0]).encodeABI();
    const { promiEvent, hash } = await cpk.execTransactions([
      {
        operation: CPK.CALL,
        to: cpk.address,
        value: 0,
        data: enableModuleData,
      },
      {
        operation: CPK.CALL,
        to: answerRecoveryModuleMasterCopy,
        value: 0,
        data: setupData,
      },
      // {
      //   operation: CPK.CALL,
      //   to: cpk.address,
      //   value: 0,
      //   data: disableModuleData,
      // }
    ]);

    notify.hash(hash);
    promiEvent.on('confirmation', () => {
      getBalance(cpk);
    });
  };

  let recoverSafe = async () => {
    let answerRecoveryModuleContract = new web3.eth.Contract(answerRecoveryModule, answerRecoveryModuleMasterCopy);
    let answer = "toyota;dog;sydney";
    answer = web3.utils.keccak256(answer);
    let recoverAccessData = await answerRecoveryModuleContract.methods.recoverAccess(answer, account).encodeABI();
    console.log(account);
    const { promiEvent, hash } = await cpk.execTransactions([
      {
        operation: CPK.CALL,
        to: answerRecoveryModuleMasterCopy,
        value: 0,
        data: recoverAccessData,
      }
    ]);

    notify.hash(hash);
    promiEvent.on('confirmation', () => {
      getIsOwner(cpk);
    });
  };

  return (
    <div>
      <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
        <Heading as={"h2"} p={3} textAlign='center'>Gnosis Safe Info</Heading>
        {cpk === undefined ? (
          <div>
            <Button width={1} m={2} onClick={createSafe}>Use Default Safe</Button>
            <Text textAlign='center'>Or</Text>
            <LoadSafeModal setSafeAddress={setSafeAddress} loadSafe={loadSafe} />
          </div>
        ) : (
          <div>
            {isOwner ? (
              <Flash my={2} variant="info">
                You are the owner of this Safe
              </Flash>
            ) : (
              <div>
                <Flash my={2} variant="warning">
                  You are not the owner of this Safe
                </Flash>
                <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
                  <Heading as={"h2"} p={3} textAlign='center'>Gnosis Recovery</Heading>
                    <Button width={1} m={2} onClick={() => {recoverSafe()}}>Recover Safe</Button>
                </Card>
              </div>
            )}
            <Box p={2}>
              <Heading as={"h3"}>Address: </Heading>
              <EthAddress address={cpk.address} textLabels />
            </Box>
            <Box p={2}>
              <Heading as={"h3"}>Balance: </Heading>
              <Text>{web3.utils.fromWei(web3.utils.toBN(balance))} eth</Text>
              <FundSafeModal web3={web3} cpk={cpk} notify={notify} account={account} setBalance={setBalance}/>
              {modules.length === 0 && balance > 0 && (
                <div>
                  <Button width={1} m={2} onClick={enableRecovery}>Enable Recovery</Button>
                </div>
              )}
            </Box>
          </div>
        )}
      </Card>
    </div>
  )
}
