const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const ENV = require('./config/env')
const { errorHandler } = require('./middlewares/errorHandler')
const cvRoutes = require('./routes/cv')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const companiesRoutes = require('./routes/companies')
const recruitersRoutes = require('./routes/recruiters')
const offersRoutes = require('./routes/offers')
const applicationsRoutes = require('./routes/applications')
const mongoose = require('mongoose')
const path = require('path')
const net = require('net')
const os = require('os')

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(morgan(ENV.LOG_LEVEL))
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/cv', cvRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/companies', companiesRoutes)
app.use('/api/recruiters', recruitersRoutes)
app.use('/api/offers', offersRoutes)
app.use('/api/applications', applicationsRoutes)

app.use(errorHandler)

async function start() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recruiting'
  // Set a short selection timeout to fail fast in dev if Mongo isn't running
  attachMongoDebugLogs(uri)
  await preflightTcpCheck(uri)
  
  // Connection options optimized for MongoDB Atlas (mongodb+srv://)
  const isAtlas = uri.startsWith('mongodb+srv://')
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: isAtlas ? 30000 : 5000, // Atlas needs more time
    connectTimeoutMS: isAtlas ? 30000 : 5000,
    // Don't force IPv4 for Atlas (it uses DNS resolution)
    ...(isAtlas ? {} : { family: 4 }),
  })
  app.listen(ENV.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[backend] listening on http://localhost:${ENV.PORT}`)
  })
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err)
  process.exit(1)
})

function attachMongoDebugLogs(uri) {
  const safeUri = sanitizeMongoUri(uri)
  console.log(`[mongo] Connecting to ${safeUri}`)
  console.log(`[mongo] Host platform: ${os.platform()} ${os.release()} | Node ${process.version}`)

  mongoose.connection.on('connecting', () => console.log('[mongo] connecting...'))
  mongoose.connection.on('connected', () => console.log('[mongo] connected'))
  mongoose.connection.on('open', () => console.log('[mongo] connection open'))
  mongoose.connection.on('disconnected', () => console.log('[mongo] disconnected'))
  mongoose.connection.on('reconnected', () => console.log('[mongo] reconnected'))
  mongoose.connection.on('error', (e) => console.error('[mongo] connection error:', e?.message || e))
}

function sanitizeMongoUri(uri) {
  try {
    // hide credentials if present
    const credMatch = uri.match(/:\/\/(.*)@/)
    if (credMatch) return uri.replace(credMatch[1], '****:****')
    return uri
  } catch (_e) {
    return uri
  }
}

function parseHostPort(uri) {
  // Only handle standard mongodb:// URIs (not SRV)
  if (!uri.startsWith('mongodb://')) return null
  try {
    const withoutProto = uri.replace('mongodb://', '')
    const atIdx = withoutProto.indexOf('@')
    const hostPart = atIdx >= 0 ? withoutProto.slice(atIdx + 1) : withoutProto
    const firstSlash = hostPart.indexOf('/')
    const hosts = (firstSlash >= 0 ? hostPart.slice(0, firstSlash) : hostPart).split(',')
    // use first host for quick check
    const [host, portStr] = hosts[0].split(':')
    const port = portStr ? parseInt(portStr, 10) : 27017
    return { host, port }
  } catch (_e) {
    return null
  }
}

async function preflightTcpCheck(uri) {
  const hp = parseHostPort(uri)
  if (!hp) {
    console.log('[mongo] SRV or non-standard URI detected; skipping TCP preflight')
    return
  }
  const { host, port } = hp
  console.log(`[mongo] TCP preflight to ${host}:${port} ...`)
  await new Promise((resolve) => {
    const socket = new net.Socket()
    let done = false
    const finish = (ok, reason) => {
      if (done) return
      done = true
      try { socket.destroy() } catch {}
      console.log(`[mongo] TCP preflight ${ok ? 'OK' : 'FAILED'} ${reason ? '- ' + reason : ''}`)
      resolve()
    }
    socket.setTimeout(2000)
    socket.once('connect', () => finish(true))
    socket.once('timeout', () => finish(false, 'timeout'))
    socket.once('error', (e) => finish(false, e?.message || 'error'))
    socket.connect(port, host)
  })
}


