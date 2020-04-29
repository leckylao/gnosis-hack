import React, { useState } from 'react';
import { Form, Input, Flex, Modal, Box, Heading, Card, Button } from "rimble-ui";

export default function FundSafeModal (props){
  const {web3, cpk, notifyConfirmation, account, CPK, getBalance} = props;
  const [amount, setAmount] = useState(0);
  const [isOpenDeposit, setIsOpenDeposit] = useState(false);
  const [isOpenWithdraw, setIsOpenWithdraw] = useState(false);

  let withdraw = async (e) => {
    e.preventDefault();
    const { promiEvent, hash } = await cpk.execTransactions([
      {
        operation: CPK.CALL,
        to: account,
        value: web3.utils.toWei(amount),
        data: '0x',
      }
    ]);

    setIsOpenWithdraw(false);
    notifyConfirmation(hash);
    promiEvent.on('confirmation', () => {
      getBalance(cpk);
    });
  };

  function deposit(e) {
    e.preventDefault();
    web3.eth.sendTransaction({
      from: account,
      to: cpk.address,
      value: web3.utils.toWei(amount)})
      .on('transactionHash', hash => {
        setIsOpenDeposit(false);
        notifyConfirmation(hash);
      }).then(async () => {
        getBalance(cpk);
      });
  };

  return (
    <div>
      <Button width={1/3} mx={4} my={2} onClick={() => { setIsOpenDeposit(true) }}>Deposit</Button>
      <Button width={1/3} mx={3} my={2} onClick={() => { setIsOpenWithdraw(true) }}>Withdraw</Button>
      <Modal isOpen={isOpenDeposit}>
        <Card p={0}>
          <Form onSubmit={deposit} >
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
              <Button.Outline onClick={() => {setIsOpenDeposit(false)}}>Cancel</Button.Outline>
              <Button type="submit" ml={3}>Deposit</Button>
            </Flex>
          </Form>
        </Card>
      </Modal>
      <Modal isOpen={isOpenWithdraw}>
        <Card p={0}>
          <Form onSubmit={withdraw} >
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
              <Button.Outline onClick={() => {setIsOpenWithdraw(false)}}>Cancel</Button.Outline>
              <Button type="submit" ml={3}>Withdraw</Button>
            </Flex>
          </Form>
        </Card>
      </Modal>
    </div>
  )
}
