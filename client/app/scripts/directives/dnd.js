'use strict';

var m = angular.module('directives.dnd', ['ui.bootstrap.dialog']);


m.directive('dndModal', function($parse, $dialog) {
  return {
    restrict: 'EA',
    terminal: true,
    link: function(scope, elm, attrs) {
      var opts = scope.$eval(attrs.options);
      var shownExpr = attrs.dndModal;

      opts = angular.extend(opts, {
        template: elm.html(),
        resolve: { $scope: function() { return scope; }}
      });
      elm.remove();

      var dialog = $dialog.dialog(opts);
      var dragger = new Dragger(dialog.modalEl);
      scope.$watch(shownExpr, function(isShown, oldShown) {
        if (isShown) {
          dragger.bind();
          dialog.open().then(function() {
            dragger.unbind();
            $parse(attrs.close)(scope);
          });
        } else {
          if (dialog.isOpen()) {
            dragger.unbind();
            dialog.close();
          }
        }
      });
      scope.$watch('step', function(step, oldStep) {
        if (step == FeedbackStep.HIGHLIGHT) {
          dialog.backdropEl.css('opacity', 0.3);
        } else {
          dialog.backdropEl.css('opacity', 0.8);
        }
      })
    }
  };
});

// Move the dialog when transitioning to any position.
// Use ngAnimate or similar for the dialog movements.
// Highlight step dialog UI.
// Make squares, remove then and draw them to the canvas in the final step.
