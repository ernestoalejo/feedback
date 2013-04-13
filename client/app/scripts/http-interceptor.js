'use strict';


var m = angular.module('httpInterceptor', []);

m.config(function($httpProvider) {
  $httpProvider.responseInterceptors.push('httpInterceptor');
});

m.factory('httpInterceptor', function($q) {
  return function(promise) {
    return promise.then(function(response) {
      return response;
    }, function(response) {
      alert('http error!');
      return $q.reject(response);
    });
  }
});
