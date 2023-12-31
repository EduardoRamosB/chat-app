import mongoose, { Document, Schema } from 'mongoose'

export interface IUrls {
  url: string
  transcript: string
}
export interface IMessage {
  content: string
  role: string
  urls?: IUrls[]
  state: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IChat extends Document {
  agent: string
  title: string
  description: string
  messages: IMessage[]
  state: string
}

const messageSchema = new Schema(
  {
    content: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    urls: [Object],
    state: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const chatSchema = new mongoose.Schema(
  {
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    messages: { type: [messageSchema] },
    state: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

const Chat = mongoose.model<IChat>('Chat', chatSchema)

export default Chat
