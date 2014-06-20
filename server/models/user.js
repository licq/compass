'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  crypto = require('crypto'),
  validator = require('validator');


var userSchema = new Schema({
  name: {
    type: String,
    required: [true, '姓名不能为空']
  },
  email: {
    type: String,
    required: [true, 'Email不能为空'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email格式不正确']
  },

  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },

  title: String,
  deleted: {
    type: Boolean,
    default: false
  },

  hashed_password: String,
  provider: String,
  salt: String
});

userSchema.plugin(timestamps);

userSchema.virtual('password').set(function (password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
}).get(function () {
  return this._password;
});

var validatePresenceOf = function (value) {
  return value && value.length;
};

userSchema.path('name').validate(function (name) {
  return (typeof name === 'string' && name.length > 0);
}, '姓名不能为空');

userSchema.path('email').validate(function (email) {
  if (!this.provider) return true;
  return (typeof email === 'string' && email.length > 0);
}, 'Email不能为空');

userSchema.path('hashed_password').validate(function (hashed_password) {
  if (!this.provider) return true;
  return (typeof hashed_password === 'string' && hashed_password.length > 0);
}, '密码不能为空');


userSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.provider)
    next(new Error('Invalid password'));
  else
    next();
});

userSchema.methods = {
  authenticate: function (plainText) {
    return !this.deleted && this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  withPermissions: function(cb){
    this.populate('role', 'name permissions', cb);
  }
};

mongoose.model('User', userSchema);
