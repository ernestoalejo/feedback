'use strict';

var m = angular.module('directives.backdrop', ['directives.dnd']);


m.directive('backdropOpacity', function($parse) {
  return {
    restrict: 'EA',
    priority: 198,
    link: function(scope, elm, attrs, dndModal) {
      scope.$watch(attrs.backdropOpacity, function(expr, oldExpr) {
        scope.dialog.backdropEl.css('opacity', expr ? 0.3 : 0.8);
      });
    }
  };
});


m.directive('backdropDrawable', function($parse) {
  return {
    restrict: 'EA',
    priority: 199,
    link: function(scope, elm, attrs, dndModal) {
    }
  };
});

// Move the dialog when transitioning to any position.
// Use ngAnimate or similar for the dialog movements.
// Highlight step dialog UI.
// Make squares, remove then and draw them to the canvas in the final step.
