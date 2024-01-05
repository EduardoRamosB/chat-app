import { useEffect, useState } from 'react'
import axiosIns from '../lib/api'
import { GridItem, useToast, useDisclosure } from '@chakra-ui/react'
import CreateChat from './CreateChat'
import ChatList from './ChatList'
import Chat from './Chat'
import { Layout } from './views/Layout'

const INIT_AGENT: InitAgent = { name: '', prompt: '', avatar: '', state: 'enabled' }
const INIT_CHAT: InitChat = { title: '', agent_id: '', description: '' }
const INIT_MSG: InitMessage = { content: '', role: '', urls: [] }
const INIT_DELTA: IMessage = {
  _id: 'deltaMsgID',
  role: 'assistant',
  content: '',
  urls: [],
  state: '',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const ChatPage = () => {
  const [agents, setAgents] = useState<IAgent[]>([])
  const [newAgent, setNewAgent] = useState<InitAgent>(INIT_AGENT)
  const [chats, setChats] = useState<IChat[]>([])
  const [newChat, setNewChat] = useState<InitChat>(INIT_CHAT)
  const [activeChat, setActiveChat] = useState<IChat | undefined>(undefined)
  const [newMessage, setNewMessage] = useState<InitMessage>(INIT_MSG)
  const [file, setFile] = useState<File | null>(null)
  const [fileS3Url, setFileS3Url] = useState('')

  const [isPainting, setIsPainting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { isOpen, onOpen: onOpenMod, onClose } = useDisclosure()
  const toast = useToast()

  useEffect(() => {
    axiosIns
      .get(`/api/agents`)
      .then((r) => {
        const agents = r.data

        setAgents(agents)
      })
      .catch((e) => console.log(e))

    axiosIns
      .get(`/api/chats`)
      .then((r) => {
        const chats = r.data

        setChats(chats)
      })
      .catch((e) => console.log(e))
  }, [])

  const createAgent = () => {
    if (newAgent.name !== '' && newAgent.prompt !== '') {
      const now = new Date()
      const agent: NewAgent = { ...newAgent, createdAt: now, updatedAt: now }
      setIsLoading(true)
      setNewAgent(INIT_AGENT)

      axiosIns
        .post('/api/agents', agent)
        .then((r) => {
          const agentDB = r.data

          setAgents((prev) => [agentDB, ...prev])
          setIsLoading(false)
          toast({
            title: 'Agent created.',
            description: "We've created your Agent.",
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
        })
        .catch((e) => console.log(e))
    }
  }

  const createAvatar = () => {
    if (newAgent.prompt !== '') {
      setIsPainting(true)
      const data = { prompt: newAgent.prompt }

      axiosIns
        .post('/api/agents/avatar', data)
        .then((r) => {
          setNewAgent((prev) => ({ ...prev, avatar: r.data.url }))
          setIsPainting(false)
        })
        .catch((e) => console.log(e))
    }
  }

  const createChat = () => {
    if (newChat.title !== '' && newChat.agent_id !== '') {
      const { agent_id: agent, ...rest } = newChat

      axiosIns
        .post('/api/chats', { agent, ...rest })
        .then((r) => {
          const chatDB = r.data

          setChats([chatDB, ...chats])
          setNewChat(INIT_CHAT)
          onClose()
        })
        .catch((e) => console.log(e))
    }
  }

  const createMessage = async () => {
    if (newMessage.content !== '') {
      setIsTyping(true)

      try {
        const r = await axiosIns.post('/api/chats/' + activeChat?._id + '/messages', {
          ...newMessage,
          role: 'user',
          urls: [{ url: fileS3Url, transcript: '' }],
        })
        const updatedChat: IChat = r.data
        console.log('updatedChat:', updatedChat)
        const updatedChats: IChat[] = chats.map((chat) =>
          chat._id === activeChat?._id ? updatedChat : chat
        )

        setActiveChat(updatedChat)
        setChats(updatedChats)
        setNewMessage(INIT_MSG)
        setFile(null)
        setFileS3Url('')

        getStreaming(updatedChat)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getStreaming = async (activeChat: IChat) => {
    try {
      let completion = ''

      const response = await fetch('http://localhost:3000/api/chats/messages/stream', {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: activeChat._id }),
      })

      if (!response.ok || !response.body) {
        throw response.statusText
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      const loopRunner = true

      while (loopRunner) {
        const { value, done } = await reader.read()
        const decodedChunk = decoder.decode(value, { stream: true })
        completion += decodedChunk

        if (decodedChunk !== '') {
          const currentMessages = [...activeChat.messages]
          currentMessages.push({ ...INIT_DELTA, content: completion })
          
          setActiveChat({ ...activeChat, messages: currentMessages })
        }

        if (done) {
          setIsTyping(false)

          axiosIns
            .get('/api/chats/' + activeChat._id)
            .then((r) => {
              const chatDB = r.data

              setChats(chats.map((ch) => (ch._id === chatDB._id ? chatDB : ch)))
              setActiveChat(chatDB)
            })
            .catch((e) => console.log(e))
          break
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Layout
        agents={agents}
        newAgent={newAgent}
        setNewAgent={setNewAgent}
        isPainting={isPainting}
        createAvatar={createAvatar}
        createAgent={createAgent}
        isLoading={isLoading}
        onOpenMod={onOpenMod}
      >
        <GridItem
          rowSpan={11}
          colSpan={3}
          p='0 20px'
        >
          <ChatList
            chats={chats}
            setChats={setChats}
            activeChat={activeChat}
            setActiveChat={setActiveChat}
          />
        </GridItem>

        <GridItem
          rowSpan={11}
          colSpan={8}
        >
          {activeChat && (
            <Chat
              messages={activeChat.messages}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              createMessage={createMessage}
              agentAvatar={activeChat.agent.avatar}
              isTyping={isTyping}
              setIsTyping={setIsTyping}
              file={file}
              setFile={setFile}
              setFileS3Url={setFileS3Url}
            />
          )}
        </GridItem>
      </Layout>

      <CreateChat
        newChat={newChat}
        setNewChat={setNewChat}
        agents={agents}
        isOpen={isOpen}
        onClose={onClose}
        createChat={createChat}
      />
    </>
  )
}

export default ChatPage
