import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, Heading, EthAddress, Card } from "rimble-ui";

export default function Web3Info(props) {
  const { web3, account} = props;
  const [balance, setBalance] = useState(0);

  let getBalance = useCallback( async () => {
    let balance = await web3.eth.getBalance(account);
    setBalance(balance);
  }, [web3, account]);

  useEffect(() => {
    if(web3 !== null)
      getBalance();
  }, [web3, getBalance]);

  return (
    <div>
      {web3 && (
        <Card maxWidth={'420px'} my={2} mx={'auto'} p={3} px={4}>
          <Heading as={"h2"} p={3} textAlign='center'>Account Info</Heading>
          <Box m={2}>
            <Heading as={"h3"}>Address: </Heading>
            <EthAddress address={account} textLabels />
          </Box>
          <Box m={2}>
            <Heading as={"h3"}>Balance: </Heading>
            <Text>{web3.utils.fromWei(web3.utils.toBN(balance))} eth</Text>
          </Box>
        </Card>
        )
      }
    </div>
  )
}
