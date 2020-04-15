import CPK from 'contract-proxy-kit';
import Web3 from 'web3';
import React from 'react';
import { Card, Form, Button, Text } from "rimble-ui";
import Web3Info from './components/Web3Info/index.js';

const infuraToken = process.env.INFURA_ID || '95202223388e49f48b423ea50a70e336';
const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/${infuraToken}`))

let init = async() => {
  const cpk = await CPK.create({ web3 });
  console.log(cpk);
}
init();

function App() {
  return (
    <div>
      <Web3Info web3={web3} />
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
