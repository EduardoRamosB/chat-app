import { Request, Response } from 'express'
import OpenAI from 'openai'
import s3 from '../libs/s3'
import Agent, { IAgent } from '../models/agent.model'

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
})

interface CreateAvatarRequest {
  prompt: string
}

export const createAvatar = async (
  req: Request<never, CreateAvatarRequest>,
  res: Response,
) => {
  const { prompt } = req.body as { prompt: string }

  try {
    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt,
      n: 1,
      size: '256x256',
      response_format: 'b64_json',
    })

    const base64ImageData = response.data[0].b64_json

    if (!base64ImageData) {
      console.error('base64ImageData is undefined')
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    const fileContent = Buffer.from(base64ImageData, 'base64')
    const s3Bucket = process.env.S3_BUCKET

    if (!s3Bucket) {
      console.error('S3_BUCKET is undefined')
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    const s3Params = {
      Bucket: s3Bucket,
      Key: `temp/${new Date().valueOf()}.jpg`,
      Body: fileContent,
      ACL: 'public-read',
    }

    const data = await s3.upload(s3Params).promise()

    console.log('File uploaded successfully. S3 URL:', data.Location)
    return res.json({ url: data.Location })
  } catch (error) {
    console.error('Error creating avatar:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const update = async (
  req: Request<{ id: string }, unknown, IAgent>,
  res: Response,
) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.json(agent)
  } catch (error) {
    console.error('Error updating agent:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const create = async (req: Request<unknown, unknown, IAgent>, res: Response) => {
  const { name, prompt, avatar } = req.body
  const agent = new Agent({
    name,
    prompt,
    avatar,
    state: 'enabled',
  })

  try {
    await agent.save()

    res.json(agent)
  } catch (error) {
    console.error('Error saving agent:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getAll = async (_req: Request, res: Response) => {
  try {
    const agents = await Agent.find({ state: 'enabled' }).sort({ createdAt: -1 })

    res.json(agents)
  } catch (error) {
    console.error('Error loading agents:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getOne = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const agents = await Agent.findById(id)

    res.json(agents)
  } catch (error) {
    console.error('Error loading agent:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const agentId = req.params.id
    const existingAgent = await Agent.findById(agentId)

    if (!existingAgent) return res.status(404).json({ error: 'Agent not found' })

    await Agent.findByIdAndDelete(agentId)

    return res.json({ message: 'Agent deleted successfully' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
