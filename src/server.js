// Nicelydone Review API — Express service that owns review records.
import express from 'express'
import {fileURLToPath} from 'node:url'
import {listReviews, getReview, createReview, updateReview, ValidationError} from './reviews.js'

export const app = express()
app.use(express.json())

// Permissive CORS so the dashboard (a separate origin) can read the records.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.get('/health', (_req, res) => {
  res.json({status: 'ok'})
})

app.get('/api/reviews', (_req, res) => {
  res.json(listReviews())
})

app.get('/api/reviews/:id', (req, res) => {
  const review = getReview(req.params.id)
  if (!review) {
    return res.status(404).json({error: 'Review not found'})
  }
  res.json(review)
})

app.post('/api/reviews', (req, res) => {
  try {
    const review = createReview(req.body)
    res.status(201).json(review)
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({error: err.message, details: err.details})
    }
    res.status(500).json({error: 'Internal server error'})
  }
})

app.patch('/api/reviews/:id', (req, res) => {
  const updated = updateReview(req.params.id, req.body)
  if (!updated) {
    return res.status(404).json({error: 'Review not found'})
  }
  res.json(updated)
})

// JSON 404 for anything else.
app.use((_req, res) => {
  res.status(404).json({error: 'Not found'})
})

const PORT = Number(process.env.PORT) || 3001

// Only listen when run directly (not when imported by tests).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`Nicelydone Review API listening on http://localhost:${PORT}`)
  })
}
