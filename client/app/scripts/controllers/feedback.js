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

  function getData() {
    var data = {};

    // Message
    data.message = $scope.message;

    // Navigator info
    data.browser = {};
    var navigatorProps = ['appCodeName', 'appName', 'appVersion', 'cookieEnabled',
      'onLine', 'platform', 'userAgent', 'javaEnabled'];
    for (var i = 0; i < navigatorProps.length; i++) {
      var name = navigatorProps[i];
      data.browser[name] = navigator[name];
    }
    data.browser.jsversion = window.jsversion;

    // Plugins info
    data.plugins = [];
    for (var i = 0; i < navigator.plugins.length; i++) {
      var plugin = navigator.plugins[i];
      data.plugins.push(plugin.name + ': ' + plugin.description);
    }

    // Page info
    data.page = {location: location.href};

    return data;
  }

  $scope.activate = function() {
    $scope.step = FeedbackStep.DESCRIPTION;
    $scope.dlgOpened = true;
    $scope.messageErr = false;
    $scope.message = '';
    $scope.screenshot = true;
    $scope.screenshotPrepared = false;
    $scope.canvas = null;

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

    $http.post('/_/feedback/message', getData()).then(function() {
      $scope.step = FeedbackStep.SUCCESS;
    });
  };

  $scope.takeScreenshot = function() {
    // Go directly to the next step if the screenshot is already taken
    if ($scope.canvas) {
      $scope.step = FeedbackStep.HIGHLIGHT;
      return;
    }

    $scope.step = FeedbackStep.SCREENSHOT;

    // Take an async screenshot and go to the next step
    setTimeout(function() {
      html2canvas(document.body, {
        onrendered: function(canvas) {
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

    // Take measures of the viewport
    var width = $(window).width();
    var height = $(window).height();
    var top = $(document).scrollTop();
    var left = $(document).scrollLeft();

    // Copy the correct area of the page
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage($scope.canvas, left, top, width, height, 0, 0, width, height);

    $scope.screenshotData = canvas.toDataURL();
    $scope.screenshotPrepared = true;

    // Prepare accordion data
    $scope.data = getData();
    $scope.groups = {
      description: false,
      screenshot: false,
      browserInfo: false,
      pageInfo: false
    };
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

  $scope.sendWithScreenshot = function() {
    if ($scope.message.length < 2) {
      $scope.messageErr = true;
      return;
    }
    $scope.messageErr = false;

    $http.post('/_/feedback/screenshot', getData()).then(function() {
      $scope.step = FeedbackStep.SUCCESS;
    });
  };

  $scope.activate();
});
