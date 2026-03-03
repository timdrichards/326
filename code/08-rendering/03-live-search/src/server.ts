import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const PORT = 3000

// Get the folder name the server is running in.
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({ extended: true }))

// EJS config
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const ITEMS = [
  'Ada Lovelace',
  'Alan Turing',
  'Grace Hopper',
  'Katherine Johnson',
  'Donald Knuth',
  'Edsger Dijkstra',
  'Margaret Hamilton',
  'Barbara Liskov',
  'Tim Berners-Lee',
  'Radia Perlman',
  'Linus Torvalds',
  'Guido van Rossum',
]

function searchItems(query: string): string[] {
  const q = query.trim().toLowerCase()

  if (!q) {
    return ITEMS.slice(0, 5)
  }

  return ITEMS.filter((item) => item.toLowerCase().includes(q)).slice(0, 8)
}

app.get('/', (_req, res) => {
  res.render('index', {
    query: '',
    results: searchItems(''),
  })
})

app.get('/search', (req, res) => {
  const query = typeof req.query.q === 'string' ? req.query.q : ''
  const results = searchItems(query)
  res.render('partials/results', { query, results })
})

app.listen(PORT, () => {
  console.log(`HTMX live search demo running at http://localhost:${PORT}`)
})
