import {test, beforeEach} from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
import {app} from '../src/server.js'
import {_resetForTests} from '../src/reviews.js'

beforeEach(() => _resetForTests())

test('GET /health returns ok', async () => {
  const res = await request(app).get('/health')
  assert.equal(res.status, 200)
  assert.deepEqual(res.body, {status: 'ok'})
})

test('GET /api/reviews returns the three seeded records', async () => {
  const res = await request(app).get('/api/reviews')
  assert.equal(res.status, 200)
  assert.equal(res.body.length, 3)
  assert.deepEqual(
    res.body.map((r) => r.id).sort(),
    ['rev-101', 'rev-102', 'rev-103'],
  )
})

test('GET /api/reviews/:id returns one record', async () => {
  const res = await request(app).get('/api/reviews/rev-102')
  assert.equal(res.status, 200)
  assert.equal(res.body.title, 'Search result caching')
})

test('GET /api/reviews/:id returns JSON 404 for unknown id', async () => {
  const res = await request(app).get('/api/reviews/nope')
  assert.equal(res.status, 404)
  assert.equal(res.body.error, 'Review not found')
})

test('POST /api/reviews creates a valid review', async () => {
  const res = await request(app)
    .post('/api/reviews')
    .send({title: 'New review', repository: 'nicelydone/x', author: 'Jo Carter', rating: 4})
  assert.equal(res.status, 201)
  assert.equal(res.body.rating, 4)
  assert.match(res.body.id, /^rev-/)
})

test('POST /api/reviews rejects missing fields with JSON error', async () => {
  const res = await request(app).post('/api/reviews').send({title: 'x'})
  assert.equal(res.status, 400)
  assert.equal(res.body.error, 'Invalid review payload')
  assert.ok(res.body.details.repository)
  assert.ok(res.body.details.author)
  assert.ok(res.body.details.rating)
})

test('POST /api/reviews rejects out-of-range and non-integer ratings', async () => {
  for (const rating of [0, 6, 3.5, '4']) {
    const res = await request(app)
      .post('/api/reviews')
      .send({title: 't', repository: 'r', author: 'a', rating})
    assert.equal(res.status, 400)
    assert.ok(res.body.details.rating)
  }
})
