interface IAgent {
  _id: string
  name: string
  prompt: string
  avatar: string
  state: string
  createdAt: Date
  updatedAt: Date
}

type InitAgent = Omit<IAgent, '_id' | 'createdAt' | 'updatedAt'>
type NewAgent = Omit<IAgent, '_id'>
