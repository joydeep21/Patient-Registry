const {Schema, model, models} = require('mongoose')
const {ROLE} = require('../config/roles')

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'operator',
      enum: [ROLE.operator, ROLE.admin, ROLE.analytics],
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
    },
    department: {
      type: String,
    }
  },
  {timestamps: true}
)

const User = models.users ? models.users : model('users', UserSchema)

module.exports = User
