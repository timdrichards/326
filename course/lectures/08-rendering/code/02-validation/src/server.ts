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

type FormState = {
  username: string
  error?: string
}

const MIN_LENGTH = 4

function parseUsername(body: Record<string, unknown>): string {
  const raw = typeof body.username === 'string' ? body.username : ''
  return raw.trim()
}

function renderForm(res: express.Response, state: FormState) {
  res.render('partials/form', { state, minLength: MIN_LENGTH })
}

app.get('/', (_req, res) => {
  res.render('index', {
    state: { username: '' },
    minLength: MIN_LENGTH,
  })
})

app.post('/validate', (req, res) => {
  const username = parseUsername(req.body as Record<string, unknown>)

  if (username.length < MIN_LENGTH) {
    const error = `Username must be at least ${MIN_LENGTH} characters.`
    const state: FormState = { username, error }

    if (req.get('HX-Request') === 'true') {
      renderForm(res, state)
      return
    }

    res.render('index', { state, minLength: MIN_LENGTH })
    return
  }

  const successModel = { username }

  if (req.get('HX-Request') === 'true') {
    res.render('partials/success', successModel)
    return
  }

  res.render('index', {
    state: { username: '' },
    minLength: MIN_LENGTH,
    success: successModel,
  })
})

app.listen(PORT, () => {
  console.log(`HTMX validation demo running at http://localhost:${PORT}`)
})
