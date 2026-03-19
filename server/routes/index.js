const express = require("express")
const router = express.Router()

const authRouter = require('./auth')
const novelsRouter = require('./novels')
const statisticsRouter = require('./statistics')
const userRouter = require('./user')
const adminRouter = require('./admin')
const applicationRouter = require('./application')
const authorRouter = require('./author')
const messageRouter = require('./message')

router.use(authRouter)
router.use(novelsRouter)
router.use(statisticsRouter)
router.use(userRouter)
router.use(adminRouter)
router.use(applicationRouter)
router.use(authorRouter)
router.use(messageRouter)

module.exports = router