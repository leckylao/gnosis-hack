import React, { useState } from 'react';
import { Form, Input, Flex, Modal, Box, Heading, Card, Button } from "rimble-ui";

export default function LoadSafeModal (props){
  const { setSafeAddress,  loadSafe } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Button width={1} m={2} onClick={() => { setIsOpen(true) }}>Load Existing Safe</Button>
      <Modal isOpen={isOpen}>
        <Card p={0}>
          <Form onSubmit={loadSafe} >
            <Box p={4} >
              <Heading.h3>Safe address</Heading.h3>
              <Input
                width={1}
                mt={3}
                type="text"
                required={true}
                placeholder="e.g. 0xAc03BB73b6a9e108530AFf4Df5077c2B3D481e5A"
                onChange={e => {setSafeAddress(e.target.value)}}
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
              <Button type='submit' ml={3}>Load Safe</Button>
            </Flex>
          </Form>
        </Card>
      </Modal>
    </div>
  )
}
