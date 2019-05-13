import { Router } from 'express'
import controllers from './job.controllers'
import { protect } from '../../utils/auth'

// import JOBS from '../data/jobs'
// import USERS from '../data/users'

const router = Router()

// Helpers
// const searchJobs = searchTerm => JOBS.filter(({ title }, i) => title.toLowerCase().includes(searchTerm.toLowerCase()))
// const getJobById = jobId => JOBS.find(({ id }) => id === jobId)

router
  .route('/')
  .get(controllers.getMany)
  // .get(controllers.getOne)
  .post(protect, controllers.createOne)

router
  .route('/:id')
  .get(controllers.getOne)
  .put(protect, controllers.updateOne)
  .delete(protect, controllers.removeOne)

export default router
