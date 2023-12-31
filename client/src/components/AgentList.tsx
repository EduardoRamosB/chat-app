import React from 'react'
import { Card, CardBody, Flex, Image, Text, Box, Stack } from '@chakra-ui/react'

interface IAgentListProps {
  agents: IAgent[]
}

const AgentList: React.FC<IAgentListProps> = ({ agents }) => {
  return (
    <>
      {agents.map((agent) => {
        return (
          <Card
            key={agent._id}
            mb='15px'
            bgColor='#2e333d'
          >
            <CardBody>
              <Flex color='white'>
                <Box w='20%'>
                  <Image
                    src={agent.avatar !== '' ? agent.avatar : '/robot01.png'}
                    borderRadius='20%'
                  />
                </Box>
                <Box
                  w='80%'
                  ml='15px'
                >
                  <Stack>
                    <Text as='b'>{agent.name}</Text>
                    <Text
                      noOfLines={2}
                      fontSize='sm'
                    >
                      {agent.prompt}
                    </Text>
                  </Stack>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        )
      })}
    </>
  )
}

export default AgentList
