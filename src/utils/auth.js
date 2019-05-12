// import config from '../config'
// import { User } from '../resources/user/user.model'
// import jwt from 'jsonwebtoken'
import USERS from '../resources/data/users'


export const signup = (req, res) => {
  const { email, password } = req.body
  if (email && password) { // TODO: validate
    const exists = USERS.some(user => user.email === email)
    if (!exists) {
      const user = { email, password, id: USERS.length + 1, favorites: [] }
      USERS.push(user)
      req.session.userId = user.id
      res.status(200).json({ success: 'Successfully signedup' });
    } else {
      res.status(403).json({ error: 'user exists, please signin' });
    }
  }
  else {
    res.status(403).json({ error: 'something is wrong, please check your email and password' });
  }
}

export const signin = (req, res) => {
  const { email, password } = req.body

  if (email && password) {
    const user = USERS.find(user => user.email === email && user.password === password) // TODO: hash pwd

    if (user) {
      req.session.userId = user.id
      res.status(200).json({ success: 'Successfully signedin' });

    } else {
      res.status(403).json({ error: 'user is not found, please check you credentials or signup' });
    }
  } else {
    res.status(403).json({ error: 'something is wrong, check your email and password' });
  }
}



export const signout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/api/job')
    }
    res.clearCookie('sid')
    res.status(200).json({ success: 'Successfully signedout' });
  })
}



// export const newToken = user => {
//   return jwt.sign({ id: user.id }, config.secrets.jwt, {
//     expiresIn: config.secrets.jwtExp
//   })
// }

// export const verifyToken = token =>
//   new Promise((resolve, reject) => {
//     jwt.verify(token, config.secrets.jwt, (err, payload) => {
//       if (err) return reject(err)
//       resolve(payload)
//     })
//   })

// export const signup = async (req, res) => {
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).send({ message: 'need email and password' })
//   }

//   try {
//     const user = await User.create(req.body)
//     const token = newToken(user)
//     return res.status(201).send({ token })
//   } catch (e) {
//     return res.status(500).end()
//   }
// }

// export const signin = async (req, res) => {
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).send({ message: 'need email and password' })
//   }

//   const invalid = { message: 'Invalid email and passoword combination' }

//   try {
//     const user = await User.findOne({ email: req.body.email })
//       .select('email password')
//       .exec()

//     if (!user) {
//       return res.status(401).send(invalid)
//     }

//     const match = await user.checkPassword(req.body.password)

//     if (!match) {
//       return res.status(401).send(invalid)
//     }

//     const token = newToken(user)
//     return res.status(201).send({ token })
//   } catch (e) {
//     console.error(e)
//     res.status(500).end()
//   }
// }

// export const protect = async (req, res, next) => {
//   const bearer = req.headers.authorization

//   if (!bearer || !bearer.startsWith('Bearer ')) {
//     return res.status(401).end()
//   }

//   const token = bearer.split('Bearer ')[1].trim()
//   let payload
//   try {
//     payload = await verifyToken(token)
//   } catch (e) {
//     return res.status(401).end()
//   }

//   const user = await User.findById(payload.id)
//     .select('-password')
//     .lean()
//     .exec()

//   if (!user) {
//     return res.status(401).end()
//   }

//   req.user = user
//   next()
// }
