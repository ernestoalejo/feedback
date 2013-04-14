'use strict';


var m = angular.module('controllers.feedback', []);


m.controller('FeedbackCtrl', function($scope) {
  $scope.activate = function() {
    if ($scope.ctrl) {
      $scope.ctrl.activate();
    } else {
      $scope.template = 'views/feedback/form.html';
    }
  };

  // TODO: Remove this
  $scope.activate();
});


var FeedbackStep = {
  DESCRIPTION: 'desc',
  SCREENSHOT: 'screenshot',
  HIGHLIGHT: 'highlight',
  REVIEW: 'review',
  SUCCESS: 'success'
};


m.controller('FeedbackFormCtrl', function($scope, $http) {
  $scope.$parent.$parent.ctrl = $scope;
  $scope.FeedbackStep = FeedbackStep;
  $scope.opts = {
    backdropFade: true,
    dialogFade: true
  };

  $scope.activate = function() {
    $scope.step = FeedbackStep.DESCRIPTION;
    $scope.dlgOpened = true;
    $scope.messageErr = false;
    $scope.message = '';
    $scope.screenshot = true;
    $scope.screenshotPrepared = false;

    // TODO: Remove this
    $scope.message = 'foobar';
    $scope.step = FeedbackStep.SCREENSHOT;
    $scope.takeScreenshot();
  };

  $scope.close = function() {
    $scope.dlgOpened = false;
  };

  $scope.sendMessageOnly = function() {
    if ($scope.message.length < 2) {
      $scope.messageErr = true;
      return;
    }
    $scope.messageErr = false;

    var msg = $scope.message;
    $scope.message = '';

    $http.post('/_/feedback/message', {message: $scope.message}).then(function() {
      $scope.step = FeedbackStep.SUCCESS;
    }).error(function() {
      $scope.message = msg;
    });
  };

  $scope.takeScreenshot = function() {
    if ($scope.canvas) {
      $scope.step = FeedbackStep.HIGHLIGHT;
      return;
    }

    $scope.step = FeedbackStep.SCREENSHOT;

    setTimeout(function() {
      html2canvas(document.body, {
        onrendered: function(canvas) {
          // TODO: Change to highlight
          $scope.$apply(function() {
            $scope.canvas = canvas;
            $scope.step = FeedbackStep.HIGHLIGHT;
          });
        },
        filterElements: function(elem) {
          return elem.className.indexOf('modal') == -1;
        }
      });
    }, 1000);
  };

  $scope.buildScreenshot = function() {
    $scope.screenshotData = '';

    var width = $(window).width();
    var height = $(window).height();
    var top = $(document).scrollTop();
    var left = $(document).scrollLeft();

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage($scope.canvas, left, top, width, height, 0, 0, width, height);

    $scope.screenshotData = canvas.toDataURL();
    $scope.screenshotPrepared = true;
  };

  $scope.reviewPrev = function() {
    $scope.step = FeedbackStep.HIGHLIGHT;
  };

  $scope.highlightPrev = function() {
    $scope.step = FeedbackStep.DESCRIPTION;
  };

  $scope.highlightNext = function() {
    $scope.step = FeedbackStep.REVIEW;
    $scope.buildScreenshot();
  };

  $scope.activate();
});
