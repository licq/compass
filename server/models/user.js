'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  _ = require('lodash'),
  Role = mongoose.model('Role'),
  Company = mongoose.model('Company'),
  ApplicationSetting = mongoose.model('ApplicationSetting'),
  timestamps = require('mongoose-timestamp'),
  crypto = require('crypto'),
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

  firstRun: {
    type: Boolean,
    default: true
  },

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
    this.populate('role', 'name permissions', cb);
  },

  hasPositions: function (inPositions, cb) {
    if (inPositions && !Array.isArray(inPositions))
      inPositions = [inPositions];
    var model = this;
    ApplicationSetting
      .findOne({company: this.company})
      .select('positionRightControlled')
      .exec(function (err, res) {
        var controlled = res && res.positionRightControlled;
        if (controlled) {
          model.populate('positions', 'name', function (err, user) {
            var outPositions = _.pluck(user.positions, 'name');
            if (inPositions) {
              outPositions = _.intersection(inPositions, outPositions);
              cb(err, outPositions);
            }
            else {
              cb(err, outPositions);
            }
          });
        }
        else {
          cb(err, inPositions);
        }
      }
    );
  },

  isSystemAdmin: function (cb) {
    Role.findOne({_id: this.role}).exec(function (err, role) {
      if (err) return cb(err, false);
      cb(err, role.isSystemAdmin());
    });
  }
};

function arrayToString(array) {
  return  _.map(array, function (element) {
    return element.toString();
  });
}

function updatePositions(positionsOfUser, user, operation, cb) {
  var Position = mongoose.model('Position');
  Position.find({_id: {$in: positionsOfUser}, company: user.company}, function (err, positions) {
    if (err) return cb(err);
    async.each(positions, function (position, callback) {
      var owners = arrayToString(position.owners || []);

      if (operation === 'add') {
        owners = _.union(owners, [user.id]);
      } else if (operation === 'remove') {
        owners = _.without(owners, user.id);
        if (owners.length === 0)
          owners = undefined;
      }
      position.owners = owners;
      position.markModified('owners');
      position.save(function (err) {
        if (err) callback(err);
        callback();
      });
    }, function (err) {
      if (err) return cb(err);
      cb(null);
    });
  });
}

userSchema.statics.createUser = function (user, cb) {
  user.save(function (err, savedUser) {
    if (err)  return cb(err);
    updatePositions(savedUser.positions, savedUser, 'add', function (err) {
      cb(err, savedUser);
    });
  });
};

userSchema.statics.deleteUser = function (user, cb) {
  user.deleted = true;
  user.save(function (err, deletedUser) {
    if (err)  return cb(err);
    updatePositions(deletedUser.positions, deletedUser, 'remove', function (err) {
      cb(err, deletedUser);
    });
  });
};

userSchema.statics.updateUser = function (user, cb) {
  this.findOne({_id: user._id}, function (err, oldUser) {
    if (err) return cb(err);
    var oldPositions = _.difference(arrayToString(oldUser.positions), arrayToString(user.positions));
    var newPositions = _.difference(arrayToString(user.positions), arrayToString(oldUser.positions));
   // user.markModified('positions');
    user.save(function (err, savedUser) {
      if (err)  return cb(err);
      updatePositions(oldPositions, savedUser, 'remove', function (err) {
        if (err) return cb(err);
        updatePositions(newPositions, savedUser, 'add', function (err) {
          cb(err, savedUser);
        });
      });
    });
  });
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
        model.findOne(
          { name: 'systemadmin',
            email: 'sysadmin@compass.com',
            company: company._id,
            role: role._id}, function (err, sysAdmin) {
            if (!sysAdmin) {
              model.create({ name: 'systemadmin',
                email: 'sysadmin@compass.com',
                password: 'compass.123',
                company: company._id,
                role: role._id,
                title: 'system admin'
              }, function (err, sysAdmin) {
                cb(err, sysAdmin);
              });
            } else {
              cb(err, sysAdmin);
            }
          });
      }
    ],
    function (err, sysAdmin) {
      if (callback) callback(err, sysAdmin);
    }
  );
};

mongoose.model('User', userSchema);
