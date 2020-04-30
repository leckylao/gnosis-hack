import React, { useState } from 'react';
import { Field, Form, Flex, Modal, Box, Heading, Card, Button } from "rimble-ui";

export default function EnableRecoveryModal (props){
  const { web3, cpk, CPK, gnosisSafe, answerRecoveryModule, answerRecoveryModuleMasterCopy, notifyConfirmation, getBalance, account, isOwner, modules, getIsOwner} = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRecovery, setIsOpenRecovery] = useState(false);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  let enableRecovery = async (e) => {
    e.preventDefault();
    let gnosisSafeContract = new web3.eth.Contract(gnosisSafe, cpk.masterCopyAddress);
    let answerRecoveryModuleContract = new web3.eth.Contract(answerRecoveryModule, answerRecoveryModuleMasterCopy);
    let enableModuleData = await gnosisSafeContract.methods.enableModule(answerRecoveryModuleMasterCopy).encodeABI();
    let answer = answer1 + answer2 + answer3;
    answer = web3.utils.keccak256(answer);
    let setupData = await answerRecoveryModuleContract.methods.setup().encodeABI();
    let enableRecoveryData = await answerRecoveryModuleContract.methods.enableRecovery(answer).encodeABI();

    // Disable Module
    // const Address1 = "0x".padEnd(41, '0') + "1"
    // let disableModuleData = await gnosisSafeContract.methods.disableModule(Address1, modules[0]).encodeABI();

    const { promiEvent, hash } = await cpk.execTransactions([
      // {
      //   operation: CPK.CALL,
      //   to: answerRecoveryModuleMasterCopy,
      //   value: 0,
      //   data: setupData,
      // },
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
        data: enableRecoveryData,
      },
      // {
      //   operation: CPK.CALL,
      //   to: cpk.address,
      //   value: 0,
      //   data: disableModuleData,
      // }
    ], {gas: 1000000});

    setIsOpen(false);
    notifyConfirmation(hash);
    promiEvent.on('confirmation', () => {
      getBalance(cpk);
    });
  };

  let recoverSafe = async (e) => {
    e.preventDefault();
    let answerRecoveryModuleContract = new web3.eth.Contract(answerRecoveryModule, answerRecoveryModuleMasterCopy);
    let answer = answer1 + answer2 + answer3;
    answer = web3.utils.keccak256(answer);
    answerRecoveryModuleContract.methods.recoverAccess(answer, account).send({from: account}).on('transactionHash', hash => {
      setIsOpenRecovery(false);
      notifyConfirmation(hash);
    }).on('confirmation', () => {
      getBalance(cpk);
      getIsOwner(cpk);
    });
  };

  return (
    <div>
      {/*
        <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
          <Heading as={"h2"} p={3} textAlign='center'>Disable Module</Heading>
          <Button width={1} m={2} onClick={() => { setIsOpen(true) }}>Disable Module</Button>
        </Card>
      */}
      {modules.length === 0 && isOwner && (
        <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
          <Heading as={"h2"} p={3} textAlign='center'>Enable Recovery</Heading>
          <Button width={1} m={2} onClick={() => { setIsOpen(true) }}>Enable Recovery</Button>
        </Card>
      )}
      {modules.length > 0 && !isOwner && (
        <Card maxWidth={'420px'} mx={'auto'} my={2} p={3} px={4}>
          <Heading as={"h2"} p={3} textAlign='center'>Recover Safe</Heading>
          <Button width={1} m={2} onClick={() => {setIsOpenRecovery(true)}}>Recover Safe</Button>
        </Card>
      )}
      <Modal isOpen={isOpen}>
        <Card p={0}>
          <Form onSubmit={enableRecovery} >
            <Heading.h3 pt={2} textAlign="center">Recovery Questions</Heading.h3>
            <Box p={4} >
              <Field label="What's your favourite car?" width={1}>
                <Form.Input
                  width={1}
                  mt={3}
                  type="text"
                  required={true}
                  placeholder="e.g. Toyota"
                  onChange={(e) => setAnswer1(e.target.value)}
                />
              </Field>
              <Field label="What's your favourite animal?" width={1}>
                <Form.Input
                  width={1}
                  mt={3}
                  type="text"
                  required={true}
                  placeholder="e.g. Cow"
                  onChange={(e) => setAnswer2(e.target.value)}
                />
              </Field>
              <Field label="What's your favourite city?" width={1}>
                <Form.Input
                  width={1}
                  mt={3}
                  type="text"
                  required={true}
                  placeholder="e.g. Sydney"
                  onChange={(e) => setAnswer3(e.target.value)}
                />
              </Field>
            </Box>

            <Flex
              px={4}
              py={3}
              borderTop={1}
              borderColor={"#E8E8E8"}
              justifyContent={"flex-end"}
            >
              <Button.Outline onClick={() => {setIsOpen(false)}}>Cancel</Button.Outline>
              <Button type='submit' ml={3}>Enable Recovery</Button>
            </Flex>
          </Form>
        </Card>
      </Modal>
      <Modal isOpen={isOpenRecovery}>
        <Card p={0}>
          <Form onSubmit={recoverSafe} >
            <Heading.h3 pt={2} textAlign="center">Recovery Questions</Heading.h3>
            <Box p={4} >
              <Field label="What's your favourite car?" width={1}>
                <Form.Input
                  width={1}
                  mt={3}
                  type="text"
                  required={true}
                  placeholder="e.g. Toyota"
                  onChange={(e) => setAnswer1(e.target.value)}
                />
              </Field>
              <Field label="What's your favourite animal?" width={1}>
                <Form.Input
                  width={1}
                  mt={3}
                  type="text"
                  required={true}
                  placeholder="e.g. Cow"
                  onChange={(e) => setAnswer2(e.target.value)}
                />
              </Field>
              <Field label="What's your favourite city?" width={1}>
                <Form.Input
                  width={1}
                  mt={3}
                  type="text"
                  required={true}
                  placeholder="e.g. Sydney"
                  onChange={(e) => setAnswer3(e.target.value)}
                />
              </Field>
            </Box>

            <Flex
              px={4}
              py={3}
              borderTop={1}
              borderColor={"#E8E8E8"}
              justifyContent={"flex-end"}
            >
              <Button.Outline onClick={() => {setIsOpenRecovery(false)}}>Cancel</Button.Outline>
              <Button type='submit' ml={3}>Recover Safe</Button>
            </Flex>
          </Form>
        </Card>
      </Modal>
    </div>
  )
}
