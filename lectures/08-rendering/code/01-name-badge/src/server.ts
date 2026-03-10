import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const PORT = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

type BadgeViewModel = {
  name: string
  title: string
}

function normalizeBadgeInput(body: Record<string, unknown>): BadgeViewModel {
  const rawName = typeof body.name === 'string' ? body.name : ''
  const rawTitle = typeof body.title === 'string' ? body.title : ''

  return {
    name: rawName.trim() || 'Anonymous Human',
    title: rawTitle.trim() || 'Guest',
  }
}

app.get('/', (_req, res) => {
  res.render('index')
})

app.post('/badge', (req, res) => {
  const badge = normalizeBadgeInput(req.body as Record<string, unknown>)

  // HTMX requests get only the fragment for the target area.
  if (req.get('HX-Request') === 'true') {
    res.render('partials/badge-result', { badge })
    return
  }

  // Non-HTMX form POST fallback can still render a full page.
  res.render('index', { badge })
})

app.listen(PORT, () => {
  console.log(`HTMX name badge demo running at http://localhost:${PORT}`)
})
