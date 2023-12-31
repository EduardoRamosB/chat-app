/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-underscore-dangle */
import request, { Response } from 'supertest'
import mongoose from 'mongoose'
import connectTestDB from '../../../src/config/db_test'
import app from '../../../src/app'
import Agent, { IAgent } from '../../../src/models/agent.model'

describe('AGENTS API', () => {
  beforeAll(async () => {
    await connectTestDB()
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('GET /api/agents', () => {
    let response: Response

    beforeEach(async () => {
      response = await request(app).get('/api/agents').send()
    })

    it(' should works', async () => {
      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toContain('json')
    })

    it('should return an array of Agents', async () => {
      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('POST /api/agents', () => {
    afterAll(async () => {
      await Agent.deleteMany({ name: 'test agent' })
    })

    const newAgent = {
      name: 'test agent',
      prompt: 'Simple and funny',
      avatar: '',
      state: 'enabled',
    }

    const newWrongAgent = {
      name: 'test agent',
      avatar: '',
      state: 'enabled',
    }

    it('should create a new Agent', async () => {
      const response: Response = await request(app).post('/api/agents').send(newAgent)
      console.log('response.body:', response.body)

      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe(newAgent.name)
    })

    it(' should not to save the Agent', async () => {
      const response: Response = await request(app)
        .post('/api/agents')
        .send(newWrongAgent)
      console.log('response.body:', response.body)
      expect(response.status).toBe(400)
      expect(response.body).toContain('Prompt is required')
    })
  })

  describe('PATCH /api/agents/:id', () => {
    let agent: IAgent

    beforeEach(async () => {
      agent = await Agent.create({
        name: 'test agent',
        prompt: 'Simple and funny',
        avatar: '',
        state: 'enabled',
      })
    })

    afterEach(async () => {
      await Agent.findByIdAndDelete(agent._id.toString())
    })

    it('should to update the Agent', async () => {
      const response: Response = await request(app)
        .patch(`/api/agents/${agent._id.toString()}`)
        .send({
          name: 'agent updated',
        })

      expect(response.body._id).toBeDefined()
      expect(response.body.name).toBe('agent updated')
    })
  })

  describe('', () => {
    let agent: IAgent
    let response: Response

    beforeEach(async () => {
      agent = await Agent.create({
        name: 'agent to delete',
        prompt: 'Simple and funny',
        avatar: '',
        state: 'enabled',
      })
      response = await request(app).delete(`/api/agents/${agent._id.toString()}`).send()
      console.log('response.body', response.body)
    })

    it('should delete the Agent', async () => {
      expect(response.body.message).toContain('Agent deleted successfully')

      const foundAgent = await Agent.findById(agent._id.toString())
      expect(foundAgent).toBeNull()
    })
  })
})
