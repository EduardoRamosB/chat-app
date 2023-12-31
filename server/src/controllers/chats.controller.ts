import OpenAI from 'openai'
import { Request, Response } from 'express'
import Chat, { IChat, IMessage } from '../models/chat.model'
import Agent from '../models/agent.model'
import getPresignedUrl from '../utils/files'

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
})

export const getStream = async (
  req: Request<never, never, { chatId: string }, never>,
  res: Response,
) => {
  const chat = await Chat.findById(req.body.chatId)
  const agent = await Agent.findById(chat?.agent)

  if (chat && agent) {
    const sysMsg = {
      role: 'system',
      content: `${agent.prompt}, 
    the user can upload images, in that case you can see this tag image:, that image: has the description of the image.
    Please do not say you are an artificial intelligence and you can not see images, the user knows it`,
    }
    const userAssitant = chat.messages.map((m) => {
      if (m.urls) {
        if (m.urls?.length !== 0 && m.urls[0].url !== '') {
          return { role: m.role, content: `${m.content}, image: ${m.urls[0].transcript}` }
        }

        return { role: m.role, content: m.content }
      }

      return { role: m.role, content: m.content }
    })
    const history = [sysMsg, ...userAssitant]

    console.log('history:', history)
    let content = ''

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: history as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      stream: true,
    })

    // eslint-disable-next-line no-restricted-syntax
    for await (const part of stream) {
      const delta = part.choices[0]?.delta.content ?? ''

      content += delta
      res.write(delta)
    }
    console.log('content:', content)
    const message = {
      content,
      role: 'assistant',
      url: [],
      state: 'enabled',
    }
    chat.messages.push(message)
    await chat.save()
  }

  res.end()
}

export const createMessage = async (
  req: Request<{ id: string }, unknown, IMessage>,
  res: Response,
) => {
  const message = { ...req.body, state: 'enabled' }
  console.log('message:', message)

  try {
    let imgTranscript = ''

    if (message.urls) {
      if (message.urls[0].url !== '') {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: 'What is in this image?' },
                {
                  type: 'image_url',
                  image_url: { url: message.urls[0].url },
                },
              ],
            },
          ],
          max_tokens: 600,
        })
        console.log('response:', response.choices[0])
        imgTranscript = response.choices[0].message.content ?? ''
      }
    }
    console.log('imgTranscript:', imgTranscript)

    const chat = await Chat.findById(req.params.id).populate('agent')
    if (!chat) return res.status(404).json({ msg: 'Chat not found' })

    if (imgTranscript === '') {
      chat.messages.push(message)
    } else {
      const newUrl = [
        { url: message.urls ? message.urls[0].url : '', transcript: imgTranscript },
      ]
      chat.messages.push({ ...message, urls: newUrl })
    }

    await chat.save()

    return res.json(chat)
  } catch (error) {
    console.error('Error saving message:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const create = async (req: Request<unknown, unknown, IChat>, res: Response) => {
  const chat = new Chat({
    ...req.body,
    messages: [],
    state: 'enabled',
  })

  try {
    await chat.save()
    const populatedChat = await Chat.findById(chat.id).populate('agent')

    res.json(populatedChat)
  } catch (error) {
    console.error('Error saving chat:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('agent')

    res.json(chat)
  } catch (error) {
    console.error('Error loading chat:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getAll = async (_req: Request, res: Response) => {
  try {
    const chats = await Chat.find({ state: 'enabled' })
      .populate('agent')
      .sort({ createdAt: -1 })

    res.json(chats)
  } catch (error) {
    console.error('Error loading cahts:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const getPresigned = async (req: Request, res: Response) => {
  const url = await getPresignedUrl(req.params.filename)

  res.json({ url })
}
