import { z } from 'zod'

export const createAgentSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(1, {
      message: 'Oops! Looks like you forgot to type a name',
    }),
  prompt: z
    .string({
      required_error: 'Prompt is required',
    })
    .min(1, {
      message: 'Prompt is a must or our agents get stage fright! 😅',
    }),
})

export const updateAgentSchema = z.object({})
