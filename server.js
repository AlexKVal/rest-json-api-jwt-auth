'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const config = require('./config')
const Account = require('./app/models/account')

const app = express()
const port = process.env.PORT || 8080

mongoose.connect(config.database)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const router = express.Router()

router.get('/', function(req, res) {
  res.json({ message: 'welcome' })
})

// accounts
router.route('/accounts')
  .post(function(req, res) {
    const account = new Account()
    account.name = req.body.name

    account.save(function(err) {
      if (err) return res.send(JSON.stringify(err))

      res.json({ message: 'Account created' })
    })
  })


app.use('/api', router)

app.listen(port, function() {
  console.log('Listening on ', port)
})
