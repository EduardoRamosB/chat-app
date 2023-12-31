import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Input,
  Spacer,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import AgentList from './AgentList'

interface ICreateAgentProps {
  newAgent: InitAgent
  setNewAgent: (prevState: (newAgent: InitAgent) => InitAgent) => void
  isOpen: boolean
  onClose: () => void
  createAgent: () => void
  createAvatar: () => void
  isPainting: boolean
  isLoading: boolean
  agents: IAgent[]
}

const CreateAgent: React.FC<ICreateAgentProps> = ({
  newAgent,
  setNewAgent,
  isOpen,
  onClose,
  createAgent,
  createAvatar,
  isPainting,
  isLoading,
  agents,
}) => {
  const btnRef = React.useRef(null)

  return (
    <Drawer
      isOpen={isOpen}
      placement='right'
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent
        bg='#202329'
        color='#8e8f96'
      >
        <DrawerCloseButton data-testid='btnCloseCreateAgent' />
        <DrawerHeader>Create your Agent</DrawerHeader>

        <DrawerBody>
          <VStack mb={2}>
            <Input
              onChange={(e) => setNewAgent((p) => ({ ...p, name: e.target.value }))}
              value={newAgent.name}
              placeholder='Name here...'
              data-testid='txtAgentName'
            />
            <Textarea
              onChange={(e) => setNewAgent((p) => ({ ...p, prompt: e.target.value }))}
              value={newAgent.prompt}
              placeholder='Type a Prompt...'
              data-testid='txtAgentPrompt'
            />
          </VStack>
          <Flex mb={2}>
            <Button
              onClick={createAvatar}
              colorScheme='green'
              isDisabled={newAgent.prompt === ''}
              isLoading={isPainting}
              data-testid='btnAgentDalle'
            >
              DALL-E
            </Button>
            <Spacer />
            {newAgent.avatar !== '' && (
              <Image
                src={newAgent.avatar !== '' ? newAgent.avatar : '/robot01.png'}
                borderRadius='10%'
                maxW='50%'
                data-testid='imgAgentDalle'
              />
            )}
          </Flex>
          <Button
            onClick={createAgent}
            isDisabled={newAgent.name === '' || newAgent.prompt === ''}
            colorScheme='blue'
            w='100%'
            mb={5}
            isLoading={isLoading}
            data-testid='btnCreateAgent'
          >
            Create Agent
          </Button>
          <Divider mb={5} />
          <AgentList agents={agents} />
        </DrawerBody>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateAgent
