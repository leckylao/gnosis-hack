import React, { useState } from 'react';
import { Form, Input, Flex, Modal, Box, Heading, Card, Button } from "rimble-ui";
import GnosisSafe from '../GnosisSafe/index.js';

export default function FundSafeModal (props){
  const {web3, cpk, notify, account, setBalance} = props;
  const [amount, setAmount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  function fundSafe(e) {
    e.preventDefault();
    web3.eth.sendTransaction({
      from: account,
      to: cpk.address,
      value: web3.utils.toWei(amount)})
      .on('transactionHash', hash => {
        setIsOpen(false);
        notify.hash(hash);
      }).then(async () => {
        let balance = await web3.eth.getBalance(cpk.address);
        setBalance(balance);
      });
  };

  return (
    <div>
      <Button width={1} m={2} onClick={() => { setIsOpen(true) }}>Fund Safe</Button>
      <Modal isOpen={isOpen}>
        <Card p={0}>
          <Form onSubmit={fundSafe} >
            <Box p={4} >
              <Heading.h3>Amount</Heading.h3>
              <Input
                width={1}
                mt={3}
                type="text"
                required={true}
                placeholder="e.g. 0.01"
                onChange={e => {setAmount(e.target.value)}}
              />
            </Box>

            <Flex
              px={4}
              py={3}
              borderTop={1}
              borderColor={"#E8E8E8"}
              justifyContent={"flex-end"}
            >
              <Button.Outline onClick={() => {setIsOpen(false)}}>Cancel</Button.Outline>
              <Button type="submit" ml={3}>Fund Safe</Button>
            </Flex>
          </Form>
        </Card>
      </Modal>
    </div>
  )
}
