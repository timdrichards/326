import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const PORT = 3000

// Get the folder name the server is running in.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// In-memory counter
let count = 0

// Middleware to parse form data from request
app.use(express.urlencoded({ extended: true }))

// EJS config
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('index', { count })
})

// HTMX endpoints return partial HTML
app.post('/counter/increment', (req, res) => {
  count += 1
  res.render('partials/counter', { count })
})

app.post('/counter/decrement', (_req, res) => {
  count -= 1
  res.render('partials/counter', { count })
})

app.post('/counter/reset', (req, res) => {
  count = 0
  res.render('partials/counter', { count })
})

app.listen(PORT, () => {
  console.log(`HTMX counter running at http://localhost:${PORT}`)
})
