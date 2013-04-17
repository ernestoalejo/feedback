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
    dialogFade: true,
    backdropClick: false
  };

  $scope.activate = function() {
    $scope.setStep(FeedbackStep.DESCRIPTION);
    $scope.dlgOpened = true;
    $scope.messageErr = false;
    $scope.screenshot = true;
    $scope.screenshotPrepared = false;
    $scope.canvas = null;

    // TODO: Remove this
    $scope.message = 'foobar';
  };

  $scope.getData = function() {
    var data = {};

    // Message
    data.message = $scope.message;

    // Navigator info
    data.browser = {};
    var navigatorProps = ['appCodeName', 'appName', 'appVersion',
      'cookieEnabled', 'onLine', 'platform', 'userAgent', 'javaEnabled'];
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
  };

  $scope.prepareAccordion = function() {
    $scope.data = $scope.getData();
    $scope.groups = {
      description: false,
      screenshot: false,
      browserInfo: false,
      pageInfo: false
    };
  };

  $scope.takeScreenshot = function() {
    // Go directly to the next step if the screenshot is already taken
    if ($scope.canvas) {
      $scope.setStep(FeedbackStep.HIGHLIGHT);
      return;
    }

    $scope.setStep(FeedbackStep.SCREENSHOT);

    // Take an async screenshot and go to the next step
    setTimeout(function() {
      html2canvas(document.body, {
        onrendered: function(canvas) {
          $scope.$apply(function() {
            $scope.canvas = canvas;
            $scope.setStep(FeedbackStep.HIGHLIGHT);
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
  };

  $scope.close = function() {
    $scope.dlgOpened = false;
  };

  $scope.descriptionNext = function() {
    // Check the message
    if ($scope.message.length < 2) {
      $scope.messageErr = true;
      return;
    }
    $scope.messageErr = false;

    if ($scope.screenshot)
      $scope.takeScreenshot();
    else {
      $scope.setStep(FeedbackStep.REVIEW);
      $scope.prepareAccordion();
    }
  };

  $scope.reviewPrev = function() {
    if ($scope.screenshot)
      $scope.setStep(FeedbackStep.HIGHLIGHT);
    else
      $scope.setStep(FeedbackStep.DESCRIPTION);
  };

  $scope.highlightPrev = function() {
    $scope.setStep(FeedbackStep.DESCRIPTION);
  };

  $scope.highlightNext = function() {
    $scope.setStep(FeedbackStep.REVIEW);
    $scope.buildScreenshot();
    $scope.prepareAccordion();
  };

  $scope.send = function() {
    // Check the (possibly modified) message
    if ($scope.message.length < 2) {
      $scope.messageErr = true;
      return;
    }
    $scope.messageErr = false;

    // Send the data
    var data = $scope.getData();
    if ($scope.screenshot)
      data.screenshot = $scope.screenshotData;
    $http.post('/_/feedback/screenshot', data).then(function() {
      $scope.message = '';
      $scope.setStep(FeedbackStep.SUCCESS);
    });
  };

  $scope.setStep = function(step) {
    $scope.step = step;

    switch (step) {
      case FeedbackStep.DESCRIPTION:
      case FeedbackStep.REVIEW:
      case FeedbackStep.SUCCESS:
        $scope.dlgPosition = 'original';
        break;

      case FeedbackStep.SCREENSHOT:
      case FeedbackStep.HIGHLIGHT:
        $scope.dlgPosition = 'corner';
        break;
    }
  };

  $scope.activate();
});

