const mongoose = require('mongoose')
const omit = require('lodash.omit')
const Serializer = require('jsonapi-serializer').Serializer
const Deserializer = require('jsonapi-serializer').Deserializer

const Schema = mongoose.Schema

const schema = new Schema({
  name: String,
  camelCasedAttribute: String
})

const model = mongoose.model('Account', schema)

const deserializer = new Deserializer({ keyForAttribute: 'camelCase' })
const serializer = new Serializer('account', { attributes: Object.keys(omit(schema.paths, ['_id', '__v'])) })
model.deserialize = deserializer.deserialize.bind(deserializer)
model.serialize = serializer.serialize.bind(serializer)

module.exports = model
