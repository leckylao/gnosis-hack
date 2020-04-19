import React from "react";
import { Box, Heading, Text, Link, Flex, Icon, Flash } from "rimble-ui";

class InstructionsCard extends React.Component {
  render() {
    return (
      <Flex justifyContent={"center"}>
        <Box maxWidth={"640px"} mt={4} mx={3}>
          <Flash variant={'info'}>
            <Flex>
              <Box m={1} mr={3} >
                <Icon name="Info" size={'2rem'} />
              </Box>
              <Box mr={3} pt={1}>
                <Heading fontSize={3} my={0} lineHeight={1.5}>
                  You're going to need Rinkeby ETH
                </Heading>
                <Text color={'inherit'} my={2}>
                  If you don't have any, you can request some for free. All you need is a Facebook or Twitter account.{" "}
                </Text>
                <Link
                  href="https://faucet.rinkeby.io/"
                  target="_blank"
                  title="Head to the Rinkeby faucet"
                >
                  <Box display={'inline-flex'} alignItems={'center'}>
                    Get Rinkeby ETH
                    <Icon name={'OpenInNew'} size={'18px'} mb={'2px'} ml={2} />
                  </Box>
                </Link>
              </Box>
            </Flex>
          </Flash>
        </Box>
      </Flex>
    );
  }
}

export default InstructionsCard;
