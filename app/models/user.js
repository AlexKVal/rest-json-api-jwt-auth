const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin']
  },
  password: String // for demonstration purposes
})

module.exports = mongoose.model('User', UserSchema)
