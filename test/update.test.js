import {test, beforeEach} from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import {app} from '../src/server.js'
import {_resetForTests} from '../src/reviews.js'

beforeEach(() => _resetForTests())

test('PATCH /api/reviews/:id updates fields', async () => {
  const res = await request(app)
    .patch('/api/reviews/rev-101')
    .send({title: 'Checkout validation v2', rating: 4})
  assert.equal(res.status, 200)
  assert.equal(res.body.title, 'Checkout validation v2')
  assert.equal(res.body.rating, 4)
})

test('PATCH /api/reviews/:id returns JSON 404 for unknown id', async () => {
  const res = await request(app).patch('/api/reviews/nope').send({title: 'x'})
  assert.equal(res.status, 404)
  assert.equal(res.body.error, 'Review not found')
})
