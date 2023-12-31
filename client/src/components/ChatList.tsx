import { Card, CardBody, Text, VStack, Image, Stack, Box, Flex } from '@chakra-ui/react'
import React from 'react'

interface IChatListProps {
  chats: IChat[]
  setChats: (newChats: IChat[]) => void
  activeChat: IChat | undefined
  setActiveChat: (chat: IChat) => void
}

const ChatList: React.FC<IChatListProps> = ({ chats, activeChat, setActiveChat }) => {
  return (
    <VStack>
      {chats.map((chat) => {
        return (
          <Card
            key={chat._id}
            onClick={() => setActiveChat(chat)}
            bg={activeChat?._id === chat._id ? '#2e333d' : '#202329'}
            color='#d1d5db'
            cursor='pointer'
          >
            <CardBody>
              <Flex>
                <Box w='20%'>
                  <Image
                    src={chat.agent.avatar === '' ? '/robot01.png' : chat.agent.avatar}
                    borderRadius='20%'
                  />
                </Box>
                <Box
                  w='80%'
                  ml='15px'
                >
                  <Stack>
                    <Text as='b'>{chat.title}</Text>
                    <Text
                      noOfLines={2}
                      fontSize='sm'
                    >
                      {chat.description}
                    </Text>
                  </Stack>
                </Box>
              </Flex>
            </CardBody>
          </Card>
        )
      })}
    </VStack>
  )
}

export default ChatList
