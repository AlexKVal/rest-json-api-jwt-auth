'use strict'
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 8080

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const router = express.Router()

router.get('/', function(req, res) {
  res.json({ message: 'welcome' })
})

app.use('/api', router)

app.listen(port, function() {
  console.log('Listening on ', port)
})
