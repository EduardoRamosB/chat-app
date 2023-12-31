interface IChat {
  _id: string
  agent: IAgent
  title: string
  description: string | null
  messages: IMessage[]
  state: string
  createdAt: Date
  updatedAt: Date
}

type InitChat = Pick<IChat, 'title' | 'description'> & { agent_id: string }

interface IUrl {
  url: string
  transcript: string
}
interface IMessage {
  _id: string
  content: string
  urls: IUrl[]
  role: string
  state: string
  createdAt: Date
  updatedAt: Date
}

type InitMessage = Pick<IChat, 'content' | 'role' | 'urls'>
type NewMessage = Omit<IMessage, '_id' | 'state' | 'createdAt' | 'updatedAt'>
