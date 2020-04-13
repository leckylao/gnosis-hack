import { ULWeb3Provider } from '@unilogin/web3';
import Web3 from 'web3';
import React from 'react';
import { BaseStyles, Box, Button, Heading, Text } from "rimble-ui";

const infuraToken = process.env.REACT_APP_INFURA_TOKEN || '95202223388e49f48b423ea50a70e336';

const ulWeb3 = new ULWeb3Provider({
    provider: new Web3.providers.WebsocketProvider(
      `wss://kovan.infura.io/ws/v3/${infuraToken}`
    ),
    // relayerUrl: 'https://relayer-kovan.herokuapp.com',
    ensDomains: ['gnosishack.test'],
    applicationInfo: {
      applicationName: 'Gnosis Hack',
      logo: 'https://safe-transaction.gnosis.io/static/safe/favicon.png'
      // type: 'laptop'
    }
})

const web3 = new Web3(ulWeb3);

function App() {
  return (
    <BaseStyles>
      <Box>
        <Heading>Your Heading</Heading>
        <Text>Some of text of yours here</Text>
        <Button> click me! </Button>
      </Box>
    </BaseStyles>
  );
}

export default App;
