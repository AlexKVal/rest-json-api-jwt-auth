'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const faker = require('faker')
const jwt = require('jsonwebtoken')

const config = require('./config')
const Account = require('./app/models/account')
const User = require('./app/models/user')

const app = express()
app.set('jwtSecret', config.secret)
const port = process.env.PORT || 8080

mongoose.connect(config.database)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const router = express.Router()

router.get('/', function(req, res) {
  res.json({ message: 'welcome' })
})
router.get('/setup', function(req, res) {
  const rndName = faker.name.firstName
  const rndNumber = faker.random.number

  const usersData = [
    { name: rndName(), role: 'user', password: rndNumber().toString() },
    { name: rndName(), role: 'user', password: rndNumber().toString() },
    { name: rndName(), role: 'user', password: rndNumber().toString() },
    { name: rndName(), role: 'admin', password: rndNumber().toString() },
    { name: rndName(), role: 'admin', password: rndNumber().toString() },
    { name: rndName(), role: 'admin', password: rndNumber().toString() }
  ]

  const promises = usersData.map((userData) => User(userData).save())

  Promise.all(promises)
  .then(() => res.json({ message: 'Users added' }))
  .catch((err) => res.json(err))
})

// users
router.get('/users', function(req, res) {
  User.find({}, 'name role')
  .then((users) => res.json(users))
  .catch((err) => res.json(err))
})

function generateToken(data) {
  return jwt.sign(data, app.get('jwtSecret'), { expiresIn: 1440 * 60 }) // 24h
}

// authenticate
router.post('/auth', function(req, res) {
  const id = req.body.id
  const sentPassword = req.body.password

  if (!id || !sentPassword) return res.status(400).json({ message: 'submit id and password' })

  User.findById(id)
  .then((user) => {
    if (!user) return res.status(404).json({ message: 'user doesn\'t exist' })

    if (user.password !== sentPassword) {
      return res.status(401).json({ message: 'wrong password' })
    }

    const tokenData = {
      id: user.id,
      name: user.name,
      role: user.role
    }
    res.json({ token: generateToken(tokenData) })
  })
  .catch((err) => res.status(400).json({ message: err.message }))
})

function getToken(req) {
  // header "Authorization": "Bearer <token>"
  const header = req.headers['authorization']
  const bearerMatches = header && header.match(/Bearer\s(\S+)/)
  return bearerMatches && bearerMatches[1]
}

// authorization middleware
router.use(function(req, res, next) {
  const tokenSent = getToken(req)

  if (!tokenSent) return res.status(401).send({ message: 'No token provided' })

  jwt.verify(tokenSent, app.get('jwtSecret'), function(err, decoded) {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' })

    req.user = decoded
    next()
  })
})


/**
 * Protected routes
 */
// accounts
router.route('/accounts')

  .post(function(req, res) {
    Account({ name: req.body.name }).save()
    .then(() => res.json({ message: 'Account created' }))
    .catch((err) => res.json(err))
  })

  .get(function(req, res) {
    Account.find()
    .then((accounts) => res.json(accounts))
    .catch((err) => res.json(err))
  })


router.route('/accounts/:account_id')

  .get(function(req, res) {
    Account.findById(req.params.account_id)
    .then((account) => res.json(account))
    .catch((err) => res.json(err))
  })

  .put(function(req, res) {
    const id = req.params.account_id
    const sentAccount = req.body

    Account.findByIdAndUpdate(id, { name: sentAccount.name })
    .then(() => res.json({ message: 'Account updated' }))
    .catch((err) => res.json(err))
  })

  .delete(function(req, res) {
    Account.findByIdAndRemove(req.params.account_id)
    .then(() => res.json({ message: 'Successfully deleted' }))
    .catch((err) => res.json(err))
  })


app.use('/api', router)

app.listen(port, function() {
  console.log('Listening on ', port)
})
