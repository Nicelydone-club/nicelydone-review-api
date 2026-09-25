# nicelydone-review-api

Express service (Node.js 22) that **owns the review records** for the Nicelydone
review demo system.

## Data flow

- **This API owns the review records** (in-memory, seeded from `fixtures/reviews.json`).
- **`nicelydone-review-dashboard`** reads those records from this API.
- **This API can send a `review.completed` event** to **`nicelydone-review-notifier`**.

> ⚠️ These repositories are **disposable** demo repositories. The intentionally
> flawed pull-request branches must **not** be deployed.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Returns `{"status":"ok"}` |
| GET | `/api/reviews` | List all reviews |
| GET | `/api/reviews/:id` | Get one review (JSON 404 if missing) |
| POST | `/api/reviews` | Create a review |

`POST /api/reviews` requires `title`, `repository`, `author`, and an **integer**
`rating` from **1 through 5**. Invalid payloads return a JSON error.

Records are stored **in memory** and seeded from the fixture; a restart re-seeds.
The server listens on port **3001**.

## Run

```bash
npm install
npm test
npm start
```

Verify:

```bash
curl http://localhost:3001/health          # {"status":"ok"}
curl http://localhost:3001/api/reviews      # the three seeded records
```
