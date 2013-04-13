'use strict';


var m = angular.module('controllers.feedback', []);


m.controller('FeedbackCtrl', function($scope) {
  $scope.activate = function() {
    $scope.template = 'views/feedback/form.html';
  };
});
