import ULIFrameProvider from '@unilogin/provider';
import Web3 from 'web3'
import React from 'react';
import { Card, Form, Button, Text } from "rimble-ui";
import NetworkIndicator from "@rimble/network-indicator";

const ulProvider = ULIFrameProvider.create('rinkeby');
console.log(ulProvider);
const web3 = new Web3(ulProvider);
console.log(web3);

let networkId = "Unknown";
switch (ulProvider.config.network) {
  case "mainnet":
    networkId = 1;
    break;
  case "kovan":
    networkId = 42;
    break;
  case "ropsten":
    networkId = 3;
    break;
  case "rinkeby":
    networkId = 4;
    break;
  case "goerli":
    networkId = 5;
    break;
  default:
    break;
}

let asyncCall = async () => {
  let result = await web3.eth.requestAccounts();
  console.log(result);
}

asyncCall();

function App() {
  return (
    <div>
      <NetworkIndicator currentNetwork={networkId} requiredNetwork={4}>
        {{
          onNetworkMessage: "Connected to correct network",
          noNetworkMessage: "Not connected to anything",
          onWrongNetworkMessage: "Wrong network"
        }}
      </NetworkIndicator>
      <Card bg={'background'}>
        <Form display={'flex'} flexDirection={'column'}>
          <Text fontSize={4} mb={4}>
            Sign In
          </Text>
          <Form.Field label={'Username'}>
            <Form.Input type={'text'}  width={1} />
          </Form.Field>
          <Form.Field label={'Password'}>
            <Form.Input type={'password'}  width={1} />
          </Form.Field>
          <Form.Check label={'Remember Me'} mb={3} />
          <Button>Sign In</Button>
        </Form>
      </Card>
    </div>
  );
}

export default App;
