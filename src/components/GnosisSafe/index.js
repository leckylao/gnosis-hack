import React, { useState } from 'react';
import { Box, Text, Heading, EthAddress, Card, Button } from "rimble-ui";
import CPK from 'contract-proxy-kit';

export default function GnosisSafe(props){
  const { web3, notify, account } = props;
  const [cpk, setCpk] = useState(null);
  const [balance, setBalance] = useState(0);

  let createSafe = async () => {
    CPK.create({web3}).then(cpk => {
      setCpk(cpk);
      getBalance(cpk);
    })
  };

  let getBalance = async (cpk) => {
    let balance = await web3.eth.getBalance(cpk.address);
    setBalance(balance);
  };

  let fundSafe = async () => {
    web3.eth.sendTransaction({
        from: account,
        to: cpk.address,
        value: `${1e15}`})
    .on('transactionHash', hash => {
      notify.hash(hash);
    }).then(() => {
      getBalance(cpk);
    });
  };

  return (
    <div>
      <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
        <Heading as={"h2"} p={3} textAlign='center'>Gnosis Safe Info</Heading>
        {cpk === null ? (
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
            </Box>
          </div>
          )
        }
      </Card>
    </div>
  )
}
