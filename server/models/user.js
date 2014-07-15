'use strict';

var mongoose = require('mongoose'),
  Role = require('mongoose').model('Role'),
  Company = require('mongoose').model('Company'),
  Schema = mongoose.Schema,
  timestamps = require('mongoose-timestamp'),
  crypto = require('crypto'),
  merge = require('mongoose-merge-plugin'),
  validator = require('validator'),
  logger = require('../config/winston').logger(),
  async = require('async');


var userSchema = mongoose.Schema({
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
  positions: {type: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Position'
    }
  ]},

  title: String,
  deleted: {
    type: Boolean,
    default: false
  },

  hashed_password: String,
  provider: String,
  salt: String,
  token: String
});

userSchema.plugin(timestamps);
userSchema.plugin(merge);

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

  withPopulation: function (cb) {
    this.hashed_password = undefined;
    this.salt = undefined;
    this.populate('positions', 'name')
      .populate('role', 'name permissions', cb);
  },

  isSystemAdmin: function (cb) {
    Role.findOne({_id: this.role}).exec(function (err, role) {
      if (err) return cb(err, false);
      cb(err, role.isSystemAdmin());
    });
  }
};

userSchema.statics.createSystemAdmin = function (callback) {
  var model = this;
  async.waterfall([
    function (cb) {
      Company.findOneAndUpdate(
        {name: 'CompassLtd'},
        {name: 'CompassLtd'},
        {upsert: true}, cb);
    },
    function (company, cb) {
      Role.createRoleForSystemAdmin(company, cb);
    },
    function (role, company, cb) {
      var salt = crypto.randomBytes(16).toString('base64');
      var hashed_password = crypto.pbkdf2Sync('compass.123', new Buffer(salt, 'base64'), 10000, 64).toString('base64');
      model.findOneAndUpdate(
        { name: 'systemadmin',
          email: 'sysadmin@compass.com',
          company: company._id,
          role: role._id},
        { name: 'systemadmin',
          email: 'sysadmin@compass.com',
          salt: salt,
          hashed_password: hashed_password,
          company: company._id,
          role: role._id,
          title: 'system admin'
        },
        {upsert: true}, function (err, sysAdmin) {
          cb(err, sysAdmin);
        });
    }], function (err, sysAdmin) {
    if (callback) callback(err, sysAdmin);
  });
};

mongoose.model('User', userSchema);
