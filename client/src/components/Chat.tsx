import { ChangeEvent, useEffect, useRef } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  Flex,
  Image,
} from '@chakra-ui/react'
import { faImage, faPaperPlane } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../lib/api'
interface IChatProps {
  messages: IMessage[] | undefined
  newMessage: InitMessage
  setNewMessage: (prevState: (newMessage: InitMessage) => InitMessage) => void
  createMessage: () => void
  agentAvatar: string
  isTyping: boolean
  setIsTyping: (b: boolean) => void
  file: File | null
  setFile: (f: File) => void
  setFileS3Url: (url: string) => void
}

const Chat: React.FC<IChatProps> = ({
  messages,
  newMessage,
  setNewMessage,
  createMessage,
  agentAvatar,
  isTyping,
  setIsTyping,
  file,
  setFile,
  setFileS3Url,
}) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null)
  const scrollableBoxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to the bottom on initial render
    if (scrollableBoxRef.current) {
      scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    // Scroll to the bottom every time messages change
    if (scrollableBoxRef.current) {
      scrollableBoxRef.current.scrollTop = scrollableBoxRef.current.scrollHeight
    }
  }, [messages])

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click()
    }
  }

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files && event.target.files[0]
    console.log('fileUploaded:', fileUploaded)

    if (!fileUploaded) return

    setIsTyping(true)
    const r = await axiosInstance.get('/api/chats/presigned/' + fileUploaded.name)
    const presignedUploadUrl = r.data.url
    console.log(presignedUploadUrl)
    setFile(fileUploaded)

    if (presignedUploadUrl) {
      const response = await fetch(presignedUploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/*' },
        body: fileUploaded,
      })
      console.log('response:', response.url)
      const url = new URL(response.url)
      const baseUrl = `${url.protocol}//${url.host}${url.pathname}`
      console.log('baseUrl:', baseUrl)
      setFileS3Url(baseUrl)
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping) {
      e.preventDefault()
      createMessage()
    }
  }

  return (
    <Card
      minH='100%'
      bg='#202329'
      color='#d1d5db'
      pt='0'
    >
      <CardBody>
        <Box
          className='scrollable-box'
          ref={scrollableBoxRef}
        >
          {messages?.map((message) => {
            return (
              <Flex
                key={message._id}
                mb='20px'
              >
                <Box w='3%'>
                  <Image
                    src={message.role === 'user' ? '/vite.svg' : agentAvatar}
                    w='25px'
                    borderRadius='20%'
                  />
                </Box>
                <Box
                  w='97%'
                  ml='15px'
                >
                  <p style={{ fontWeight: 'bold', marginBottom: '0' }}>
                    {message.role === 'user' ? 'You' : 'AI'}
                  </p>
                  <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
                  {message.urls.length !== 0 &&
                    message.urls.map((objUrl, idx) => {
                      return (
                        <Image
                          key={idx}
                          src={objUrl.url}
                          w='150px'
                        />
                      )
                    })}
                </Box>
              </Flex>
            )
          })}
        </Box>
        {file && (
          <Box>
            <Image
              src={URL.createObjectURL(file)}
              maxW='100px'
              ml='40px'
            />
          </Box>
        )}
      </CardBody>

      <CardFooter>
        <Button
          onClick={handleClick}
          isDisabled={newMessage.content === '' || isTyping}
          variant='transparent'
          p='0'
        >
          <FontAwesomeIcon icon={faImage} />
        </Button>
        <InputGroup>
          <Input
            onChange={(e) =>
              setNewMessage((prev) => ({ ...prev, content: e.target.value }))
            }
            value={newMessage.content as string}
            placeholder='Message...'
            borderColor='#565662'
            data-testid='txtChatContent'
            onKeyDown={handleKeyDown}
          />
          <InputRightElement>
            <Button
              onClick={createMessage}
              isDisabled={newMessage.content === '' || isTyping}
              isLoading={isTyping}
              data-testid='btnChatCreateMessage'
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </InputRightElement>
        </InputGroup>
        <input
          type='file'
          onChange={handleChange}
          ref={hiddenFileInput}
          style={{ display: 'none' }}
          data-testid='btnUChatHandleClickImg'
        />
      </CardFooter>
    </Card>
  )
}

export default Chat
