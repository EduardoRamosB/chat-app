import React from 'react'
import { Button, Grid, GridItem, VStack, Text, useDisclosure } from '@chakra-ui/react'
import { faComment } from '@fortawesome/free-regular-svg-icons'
import { faUserAstronaut, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import CreateAgent from '../CreateAgent'

library.add(faComment, faUserAstronaut, faPaperPlane)
interface LayoutProps {
  children?: React.ReactNode
  agents: IAgent[]
  newAgent: InitAgent
  setNewAgent: (prevState: (newAgent: InitAgent) => InitAgent) => void
  createAvatar: () => void
  createAgent: () => void
  isPainting: boolean
  isLoading: boolean
  onOpenMod: () => void
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  agents,
  newAgent,
  setNewAgent,
  createAvatar,
  createAgent,
  isPainting,
  isLoading,
  onOpenMod,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Grid
      minH='100vh'
      templateRows='repeat(12, 1fr)'
      templateColumns='repeat(12, 1fr)'
    >
      <GridItem
        rowSpan={12}
        colSpan={1}
        bg='#131313'
        style={{ textAlign: 'center' }}
        p='15px'
      >
        <VStack>
          <Button
            onClick={onOpen}
            w='100%'
            variant='ghost'
            size='lg'
            data-testid='btnMenuAgent'
          >
            <FontAwesomeIcon
              icon={faUserAstronaut}
              size='xl'
              color='#9C9CA2'
            />
          </Button>
          <Button
            onClick={onOpenMod}
            w='100%'
            variant='ghost'
            size='lg'
            data-testid='btnMenuChat'
          >
            <FontAwesomeIcon
              icon={faComment}
              size='xl'
              color='#9C9CA2'
            />
          </Button>
        </VStack>
      </GridItem>

      <GridItem
        rowSpan={1}
        colSpan={11}
        bg='#202329'
        color='#8e8f96'
        p='20px'
      >
        <Text
          bgGradient='linear(to-l, #7928CA, #FF0080)'
          bgClip='text'
          fontSize='2xl'
          as='b'
        >
          &lt; Chat App /&gt;
        </Text>
      </GridItem>

      {children}

      <CreateAgent
        agents={agents}
        createAgent={createAgent}
        createAvatar={createAvatar}
        isLoading={isLoading}
        isOpen={isOpen}
        isPainting={isPainting}
        newAgent={newAgent}
        setNewAgent={setNewAgent}
        onClose={onClose}
      />
    </Grid>
  )
}
