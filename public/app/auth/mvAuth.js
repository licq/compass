'use strict';

angular.module('compass')
  .factory('mvAuth', function (mvSession, mvIdentity) {
    return {
      login: function (user, callback) {
        var cb = callback || angular.noop;

        return mvSession.save({
          email: user.email,
          password: user.password,
          remember_me: user.remember_me
        }, function (user) {
          mvIdentity.currentUser = user;
          return cb();
        }, function (err) {
          return cb(err);
        }).$promise;
      },

      logout: function (callback) {
        var cb = callback || angular.noop;

        return mvSession.delete(function () {
          mvIdentity.currentUser = undefined;
          return cb();
        }, function (err) {
          return cb(err);
        }).$promise;
      }
    };
  });