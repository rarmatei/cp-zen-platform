'use strict';

angular.module('cpZenPlatform').service('auth', function($http) {

  var loggedin_user = null;
  function topfail( data ) {
    console.error(data)
  }

  return {
    login: function(creds,win,fail){
      $http({method:'POST', url: '/auth/login', data:creds, cache:false}).
        success(win).error(fail||topfail)
    },

    logout: function(win,fail){
      $http({method:'POST', url: '/auth/logout', data:{}, cache:false}).
        success(win).error(fail||topfail)
    },

    instance: function(win,fail){
      $http({method:'GET', url: '/auth/instance', cache:false}).
        success(win).error(fail||topfail)
    },

    register: function(details,win,fail){
      $http({method:'POST', url: '/auth/register', data:details, cache:false}).
        success(win).error(fail||topfail)
    },

    reset: function(creds,win,fail){
      $http({method:'POST', url: '/auth/create_reset', data:creds, cache:false}).
        success(win).error(fail||topfail)
    },

    reset_load: function(creds,win,fail){
      $http({method:'POST', url: '/auth/load_reset', data:creds, cache:false}).
        success(win).error(fail||topfail)
    },

    reset_execute: function(creds,win,fail){
      $http({method:'POST', url: '/auth/execute_reset', data:creds, cache:false}).
        success(win).error(fail||topfail)
    },

    confirm: function(creds,win,fail){
      $http({method:'POST', url: '/auth/confirm', data:creds, cache:false}).
        success(win).error(fail||topfail)
    },

    get_loggedin_user: function (win, fail) {
      if (loggedin_user) {
        win(loggedin_user);
      }
      else {
        this.instance(function (data) {
          if (!data.user) {
            return (fail || topfail)('cannot get logged in user');
          }

          loggedin_user = data.user;
          win(loggedin_user);
        });
      }
    }
  }

})