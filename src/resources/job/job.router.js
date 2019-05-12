import { Router } from 'express'
// import controllers from './job.controllers'
import JOBS from '../data/jobs'
import USERS from '../data/users'

const router = Router()

// Helpers
const searchJobs = searchTerm => JOBS.filter(({ title }, i) => title.toLowerCase().includes(searchTerm.toLowerCase()))
const getJobById = jobId => JOBS.find(({ id }) => id === jobId)

// /api/job
router.get('/', (req, res) => {
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
})

// /api/item/:id
router.get('/:id', (req, res) => {
  return res.status(200).json({ data: getJobById(req.params.id) })
})

export default router



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

