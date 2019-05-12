import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'
import session from 'express-session'
// TODO: add a real database
import JOBS from './resources/data/jobs'
import USERS from './resources/data/users'
// routes
import jobRouter from './resources/job/job.router'
import favoriteRouter from './resources/favorite/favorite.router'
// import userRouter from './resources/user/user.router'
// import itemRouter from './resources/item/item.router'
// import listRouter from './resources/list/list.router'
// auth
import { signup, signin, signout } from './utils/auth'
// connect mongoDB
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
app.post('/signup', signup)
app.post('/signin', signin)
app.post('/signout', signout)
app.use('/api/job', jobRouter)
app.use('/api/favorite', favoriteRouter)

// // FALLBACK
// app.get('/*', (req, res) => res.redirect(WEBSITE));
// const port = process.env.PORT || 3000

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/api`)
    })
  } catch (e) {
    console.error(e)
  }
}


// const redirectlogin = (req, res, next) => {
//   if (!req.session.userId) {
//     res.redirect('/api/signin')
//   } else {
//     next()
//   }
// }

// const redirectHome = (req, res, next) => {
//   if (req.session.userId) {
//     res.redirect('/api/job')
//   } else {
//     next()
//   }
// }