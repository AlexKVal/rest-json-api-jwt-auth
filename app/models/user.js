const mongoose = require('mongoose')
const omit = require('lodash.omit')
const Serializer = require('jsonapi-serializer').Serializer
const Deserializer = require('jsonapi-serializer').Deserializer

const Schema = mongoose.Schema

const schema = new Schema({
  name: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: String // for demonstration purposes
})

const model = mongoose.model('User', schema)

const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })
const serializer = new Serializer('user', { attributes: Object.keys(omit(schema.paths, ['_id', '__v'])) })
model.deserialize = deserializer.deserialize.bind(deserializer)
model.serialize = serializer.serialize.bind(serializer)

module.exports = model
