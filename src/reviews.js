// In-memory review store, seeded from the fixture file.
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedPath = join(__dirname, '..', 'fixtures', 'reviews.json')
const seed = JSON.parse(readFileSync(seedPath, 'utf8'))

// Records live only in memory; a restart re-seeds from the fixture.
let reviews = seed.map((r) => ({...r}))

export class ValidationError extends Error {
  constructor(message, details) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

export function listReviews() {
  return reviews
}

export function getReview(id) {
  return reviews.find((r) => r.id === id)
}

// Validate and create a review. Requires title, repository, author, and an
// integer rating from 1 through 5. Throws ValidationError on bad input.
export function createReview(body = {}) {
  const {title, repository, author, rating} = body
  const details = {}

  if (typeof title !== 'string' || title.trim() === '') details.title = 'title is required'
  if (typeof repository !== 'string' || repository.trim() === '') details.repository = 'repository is required'
  if (typeof author !== 'string' || author.trim() === '') details.author = 'author is required'
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    details.rating = 'rating must be an integer from 1 through 5'
  }

  if (Object.keys(details).length > 0) {
    throw new ValidationError('Invalid review payload', details)
  }

  const review = {
    id: `rev-${Date.now()}`,
    title: title.trim(),
    repository: repository.trim(),
    author: author.trim(),
    rating,
  }
  reviews.push(review)
  return review
}

// Reset to the seeded fixture (used by tests).
export function _resetForTests() {
  reviews = seed.map((r) => ({...r}))
}
