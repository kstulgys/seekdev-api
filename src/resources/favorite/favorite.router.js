import { Router } from 'express'
// import controllers from './item.controllers'
import JOBS from '../data/jobs'
import USERS from '../data/users'
const router = Router()

// Helpers
const getJobById = jobId => JOBS.find(({ id }) => id === jobId)

// FAVORITES

// api/favorite
router.get('/', (req, res) => {
  const { user } = res.locals
  if (user) {
    const { favorites } = user;
    const favs = favorites.map(favId => getJobById(favId))
    res.status(200).json({ data: favs });
  } else {
    res.status(403).json({ message: 'You have to be signed in to see favorite jobs' });
  }
});

// api/favorite
router.post('/', async (req, res) => {
  const { user } = res.locals

  if (user) {
    const { favorites } = user;
    const { jobId } = req.body;

    if (!favorites.includes(jobId)) {
      favorites.push(jobId);
      let currentUser = await USERS.find(({ id }) => id === user.id)
      currentUser.favorites = [...favorites]
      res.status(200).json({ favorites: favorites });
    } else {
      res.status(403).json({ message: 'Job already favorited' });
    }
  }
  else {
    res.status(403).json({ message: 'You have to be signed in to favor a job' });
  }
});

// api/favorite/:id
router.delete('/:id', (req, res) => {
  const { user } = res.locals
  console.log(user)
  if (user) {
    USERS.find(({ id }) => id === user.id).favorites.filter(_id => _id !== req.params.id)
    res.status(200).json({ message: 'Job successfully deleted from favorites' });
  } else {
    res.status(403).json({ message: 'You are not authenticated' });
  }
});


// // /api/item
// router
//   .route('/')
//   .get(controllers.getOne)
//   .post(controllers.createOne)

// // /api/item/:id
// router
//   .route('/:id')
//   .get(controllers.getOne)
//   .put(controllers.updateOne)
//   .delete(controllers.removeOne)

export default router
