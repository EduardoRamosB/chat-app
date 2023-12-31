import mongoose, { Document, Schema } from 'mongoose'

export interface IAgent extends Document {
  name: string
  prompt: string
  avatar: string
  state: string
}

const agentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },
    avatar: { type: String, trim: true, default: '' },
    state: { type: String, required: true, default: 'enabled' },
  },
  {
    timestamps: true,
  },
)

const Agent = mongoose.model<IAgent>('Agent', agentSchema)

export default Agent
