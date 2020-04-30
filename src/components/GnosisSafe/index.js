import React, { useState } from 'react';
import { Flash, Box, Text, Heading, EthAddress, Card, Button } from "rimble-ui";
import CPK from 'contract-proxy-kit';
import gnosisSafe from '../../abis/GnosisSafe.json';
import answerRecoveryModule from '../../abis/AnswerRecoveryModule.json';
import LoadSafeModal from '../Modals/LoadSafeModal.js';
import FundSafeModal from '../Modals/FundSafeModal.js';
import EnableRecoveryModal from '../Modals/EnableRecoveryModal.js';

export default function GnosisSafe(props){
  const { web3, notify, account, networkId, networkIdToUrl } = props;
  const [cpk, setCpk] = useState(undefined);
  const [modules, setModules] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [safeAddress, setSafeAddress] = useState("");

  const answerRecoveryModuleMasterCopy = "0xf949A120293e2F50e6f03fFdc0Cb5bC11984AE84";

  let createSafe = async (e) => {
    e.preventDefault();
    if(safeAddress)
      CPK.load({ web3, ownerAccount: account }, safeAddress).then(cpk => {
        getIsOwner(cpk);
        setCpk(cpk);
        getBalance(cpk);
      })
    else
      CPK.create({web3, ownerAccount: account}).then(cpk => {
        setCpk(cpk);
        getBalance(cpk);
        getIsOwner(cpk);
      })
  };

  let getIsOwner = async (cpk) => {
    let getCode = await web3.eth.getCode(cpk.address);
    if(getCode === "0x")
      return setIsOwner(true);
    let gnosisSafeContract = new web3.eth.Contract(gnosisSafe, cpk.address);
    let isOwner = await gnosisSafeContract.methods.isOwner(account).call();
    setIsOwner(isOwner);
  }

  let getModules = async (cpk, balance) => {
    let getCode = await web3.eth.getCode(cpk.address);
    if( balance === 0 || getCode === "0x" )
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

  function notifyConfirmation(hash){
    const {emitter} = notify.hash(hash);
    emitter.on('all', (transaction) => {
      return {
        onclick: () => {
          window.open(`${networkIdToUrl[networkId]}/${transaction.hash}`)
        }
      }
    });
  }

  return (
    <div>
      <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
        <Heading as={"h2"} p={3} textAlign='center'>Gnosis Safe Info</Heading>
        {cpk === undefined ? (
          <div>
            <Button width={1} m={2} onClick={createSafe}>Use Default Safe</Button>
            <Text textAlign='center'>Or</Text>
            <LoadSafeModal setSafeAddress={setSafeAddress} createSafe={createSafe} />
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
              </div>
            )}
            <Box p={2}>
              <Heading as={"h3"}>Address: </Heading>
              <EthAddress address={cpk.address} textLabels />
            </Box>
            <Box p={2}>
              <Heading as={"h3"}>Balance: </Heading>
              <Text>{web3.utils.fromWei(web3.utils.toBN(balance))} eth</Text>
              <FundSafeModal web3={web3} cpk={cpk} notifyConfirmation={notifyConfirmation} account={account} CPK={CPK} getBalance={getBalance} isOwner={isOwner} />
              <EnableRecoveryModal web3={web3} cpk={cpk} gnosisSafe={gnosisSafe} answerRecoveryModule={answerRecoveryModule} answerRecoveryModuleMasterCopy={answerRecoveryModuleMasterCopy} notifyConfirmation={notifyConfirmation} getBalance={getBalance} CPK={CPK} account={account} isOwner={isOwner} modules={modules} getIsOwner={getIsOwner}/>
            </Box>
          </div>
        )}
      </Card>
    </div>
  )
}
