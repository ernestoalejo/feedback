'use strict';

var m = angular.module('directives.backdrop', ['directives.dnd']);


// Drag & Drop directive for modals (the one that creates the dialog object
// in scope) has a priority of 200. The rest should be descendent from there.


m.directive('backdropOpacity', function($parse) {
  return {
    restrict: 'EA',
    priority: 199,
    link: function(scope, elm, attrs) {
      scope.$watch(attrs.backdropOpacity, function(expr, oldExpr) {
        scope.dialog.backdropEl.css('opacity', expr ? 0.3 : 0.8);
      });
    }
  };
});


m.directive('backdropDrawable', function($parse) {
  return {
    restrict: 'EA',
    priority: 198,
    link: function(scope, elm, attrs) {
    }
  };
});

// Move the dialog when transitioning to any position: take the positions and
// sizes from the scope (use watch with an object). The positions should change
// depending on the step (make a setter in the feedbackController & a map).
// Use ngAnimate or similar for the dialog movements.
// Highlight step dialog UI.
// Make squares, remove then and draw them to the canvas in the final step.
