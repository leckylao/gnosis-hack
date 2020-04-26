import React, { useState } from 'react';
import { Box, Text, Heading, EthAddress, Card, Button } from "rimble-ui";
import CPK from 'contract-proxy-kit';
import gnosisSafe from '../../abis/GnosisSafe.json';
import answerRecoveryModule from '../../abis/AnswerRecoveryModule.json';

export default function GnosisSafe(props){
  const { web3, notify, account } = props;
  const [cpk, setCpk] = useState(undefined);
  const [modules, setModules] = useState([]);
  const [balance, setBalance] = useState(0);
  const answerRecoveryModuleMasterCopy = "0x4525AaAf8921AFF4cF364A5053187AcBcdF0572E";

  let createSafe = async () => {
    CPK.create({web3}).then(cpk => {
      setCpk(cpk);
      getBalance(cpk);
    })
  };

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

  let fundSafe = async () => {
    web3.eth.sendTransaction({
      from: account,
      to: cpk.address,
      value: `${1e15}`})
      .on('transactionHash', hash => {
        notify.hash(hash);
      }).on('confirmation', () => {
        getBalance(cpk);
      });
  };

  let enableRecovery = async () => {
    let gnosisSafeContract = new web3.eth.Contract(gnosisSafe, cpk.masterCopyAddress);
    let enableModuleData = await gnosisSafeContract.methods.enableModule(answerRecoveryModuleMasterCopy).encodeABI();
    const { promiEvent, hash } = await cpk.execTransactions([
      {
        operation: CPK.CALL,
        to: cpk.address,
        value: 0,
        data: enableModuleData,
      }
    ]);

    notify.hash(hash);
    promiEvent.on('confirmation', () => {
      getBalance(cpk);
    });
  };

  return (
    <div>
      <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
        <Heading as={"h2"} p={3} textAlign='center'>Gnosis Safe Info</Heading>
        {cpk === undefined ? (
          <div>
            <Button width={1} m={2} onClick={() => {createSafe()}}>Create Safe</Button>
          </div>
        ) : (
          <div>
            <Box p={2}>
              <Heading as={"h3"}>Address: </Heading>
              <EthAddress address={cpk.address} textLabels />
            </Box>
            <Box p={2}>
              <Heading as={"h3"}>Balance: </Heading>
              <Text>{web3.utils.fromWei(web3.utils.toBN(balance))} eth</Text>
              <Button width={1} m={2} onClick={() => {fundSafe()}}>Fund Safe with 0.001 eth</Button>
              {modules.length === 0 && balance > 0 && (
                <div>
                  <Button width={1} m={2} onClick={() => {enableRecovery()}}>Enable Recovery</Button>
                </div>
              )
              }
            </Box>
          </div>
        )
        }
      </Card>
    </div>
  )
}
