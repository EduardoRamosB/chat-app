import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  ModalFooter,
  Button,
} from '@chakra-ui/react'
import React from 'react'

interface ICreateChatProps {
  newChat: InitChat
  setNewChat: (prevState: (newChat: InitChat) => InitChat) => void
  agents: IAgent[]
  isOpen: boolean
  onClose: () => void
  createChat: () => void
}

const CreateChat: React.FC<ICreateChatProps> = ({
  newChat,
  setNewChat,
  agents,
  isOpen,
  onClose,
  createChat,
}) => {
  const initialRef = React.useRef(null)

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      size='lg'
    >
      <ModalOverlay />
      <ModalContent
        bg='#202329'
        color='#8e8f96'
      >
        <ModalHeader>Create your Chat</ModalHeader>
        <ModalCloseButton data-testid='btnCloseCreateChat' />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              onChange={(e) => setNewChat((p) => ({ ...p, title: e.target.value }))}
              value={newChat.title}
              ref={initialRef}
              placeholder='Title...'
              data-testid='txtChatTitle'
            />
          </FormControl>

          <FormControl>
            <FormLabel>Agent</FormLabel>
            <Select
              placeholder='Select an agent'
              onChange={(e) => setNewChat((p) => ({ ...p, agent_id: e.target.value }))}
              data-testid='sltChatAgent'
            >
              {agents.map((agent) => {
                return (
                  <option
                    key={agent._id}
                    value={agent._id}
                  >
                    {agent.name}
                  </option>
                )
              })}
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              onChange={(e) => setNewChat((p) => ({ ...p, description: e.target.value }))}
              value={newChat.description ?? ''}
              placeholder='Type description...'
              data-testid='txtChatDesciption'
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={createChat}
            colorScheme='blue'
            mr={3}
            isDisabled={newChat.title === '' || newChat.agent_id === ''}
            data-testid='btnCreateChat'
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateChat
