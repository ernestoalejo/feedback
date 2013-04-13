'use strict';


var m = angular.module('controllers.feedback', []);


m.controller('FeedbackCtrl', function($scope) {
  $scope.activate = function() {
    $scope.template = 'views/feedback/form.html';
  };
});


m.controller('FeedbackFormCtrl', function($scope, $http) {
  $scope.dlgOpened = true;
  $scope.opts = {
    backdropFade: true,
    dialogFade: true
  };
  $scope.screenshot = true;
  $scope.messageErr = false;
  $scope.message = '';
  $scope.successOpened = false;

  $scope.close = function() {
    $scope.dlgOpened = false;
  };

  $scope.closeSuccess = function() {
    $scope.successOpened = false;
  };

  $scope.next = function() {
    alert('next');
  };

  $scope.send = function() {
    if ($scope.message.length < 5) {
      $scope.messageErr = true;
      return;
    }
    $scope.messageErr = false;

    $scope.send = function() {
      $scope.dlgOpened = false;

      var msg = $scope.message;
      $scope.message = '';

      $http.post('/_/feedback/message', {message: $scope.message}).error(function() {
        $scope.dlgOpened = false;
        $scope.successOpened = true;
      }).error(function() {
        $scope.message = msg;
      });
    };
  };
});

