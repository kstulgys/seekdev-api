import { Router } from 'express'
// import controllers from './item.controllers'
// import JOBS from '../data/jobs'
// import USERS from '../data/users'

const router = Router()


// FAVORITES
// api/favorite/:id
router.delete('/:id', (req, res) => {
  res.status(200).json({
    message: 'handling delete request to favorites id'
  })
});


// api/favorite
router.get('/', (req, res) => {
  // if (user) {
  //   const { favorites } = user;
  //   const favs = favorites.map(favId => getJobById(favId))
  //   res.status(200).json({ data: favs });
  // } else {
  //   res.status(403).json({ message: 'You have to be signed in to see favorite jobs' });
  // }
});

// api/favorite
router.post('/', async (req, res) => {
  const { favorites } = user;
  const { jobId } = req.body;

  if (!favorites.includes(jobId)) {
    favorites.push(jobId);
    let currentUser = await USERS.find(({ id }) => id === user.id)
    currentUser.favorites = [...favorites]
    res.status(200).json({ favorites: favorites });
  } else {
    res.status(403).json({ message: 'Job already favorited' })
  }
  res.status(403).json({ message: 'You have to be signed in to favor a job' });
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
