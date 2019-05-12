import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import session from 'express-session'

// TODO: add a real database
import JOBS from './resources/data/jobs'
import USERS from './resources/data/users'
// const JOBSTest = require("./resources/data/jobs-test.json");


// import { signup, signin, protect } from './utils/auth'
// import userRouter from './resources/user/user.router'
// import itemRouter from './resources/item/item.router'
// import listRouter from './resources/list/list.router'
import { connect } from './utils/db'

export const app = express()

app.disable('x-powered-by')
app.use(session({
  name: 'sid',
  resave: false,
  saveUninitialized: false,
  secret: 'learneverything',
  cookie: {
    maxAge: 1000 * 60 * 60 * 2,
    sameSite: true,
    secure: false
  }
}))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

// app.post('/signup', signup)
// app.post('/signin', signin)

// app.use('/api', protect)
// app.use('/api/user', userRouter)
// app.use('/api/item', itemRouter)
// app.use('/api/list', listRouter)

app.use((req, res, next) => {
  const { userId } = req.session
  if (userId) {
    res.locals.user = USERS.find(user => user.id === userId)
  }
  next()
})


const redirectlogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/api/signin')
  } else {
    next()
  }
}

const redirectHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/api/job')
  } else {
    next()
  }
}

app.post('/api/signin', (req, res) => {
  const { email, password } = req.body

  if (email && password) {
    const user = USERS.find(user => user.email === email && user.password === password) // TODO: hash pwd

    if (user) {
      req.session.userId = user.id
    } else {
      res.status(403).json({ error: 'user is not found, please check you credentials or signup' });
    }
  } else {
    res.status(403).json({ error: 'something is wrong, check your email and password' });
  }
})

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body
  if (email && password) { // TODO: validate
    const exists = USERS.some(user => user.email === email)
    if (!exists) {
      const user = { email, password, id: USERS.length + 1, favorites: [] }
      USERS.push(user)
      req.session.userId = user.id
      res.redirect('/api/job')
    } else {
      res.status(403).json({ error: 'user exists, please signin' });
    }
  }
  else {
    res.status(403).json({ error: 'something is wrong, please check your email and password' });
  }
})

app.post('/api/signout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/api/job')
    }
    res.clearCookie('sid')
    res.redirect('/signin')
  })
})

// Helpers
const searchJobs = searchTerm => JOBS.filter(({ title }, i) => title.toLowerCase().includes(searchTerm.toLowerCase()))
const getJobById = jobId => JOBS.find(({ id }) => id === jobId)

app.get('/api/job', (req, res) => {
  const { search, start = 0, length = 20 } = req.query;
  const begin = parseInt(start);
  const end = begin + parseInt(length);

  if (search) {
    return res.json({
      jobs: searchJobs(search).slice(begin, end)
    });
  }
  else {
    return res.status(200).json({ data: JOBS.slice(begin, end) })
  }
});

app.get('/api/job/:id', (req, res) => {
  return res.status(200).json({ data: getJobById(req.params.id) })
})

// app.get('/session', (req, res) => {
//   res.json(req.session);
// });

// FAVORITES
app.get('/api/favorite', (req, res) => {
  const { user } = res.locals
  if (user) {
    const { favorites } = user;
    const favs = favorites.map(favId => getJobById(favId))
    res.status(200).json({ data: favs });
  } else {
    res.status(403).json({ error: 'You have to be signed in to see favorite jobs' });
  }
});


app.post('/api/favorite', (req, res) => {
  const { user } = res.locals

  if (user) {
    const { favorites } = user;
    const { jobId } = req.body;

    if (!favorites.includes(jobId)) {
      favorites.push(jobId);
      USERS.find(({ id }) => id === user.id).favorites = [...favorites]
      res.status(200).json({ data: favorites });
    } else {
      res.status(403).json({ error: 'job already favorited' });
    }
  }
  else {
    res.status(403).json({ error: 'You have to be signed in to favor a job' });
  }
});


// // FALLBACK
// app.get('/*', (req, res) => res.redirect(WEBSITE));
const port = process.env.PORT || 3000

export const start = async () => {
  try {
    await connect()
    app.listen(port, () => {
      console.log(`REST API on http://localhost:${port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}
