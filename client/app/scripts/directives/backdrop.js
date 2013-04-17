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


m.directive('dialogPosition', function($parse) {
  return {
    restrict: 'EA',
    priority: 197,
    link: function(scope, elm, attrs) {
      scope.$watch(attrs.dialogPosition, function(pos, oldPos) {
        var marginLeft = scope.dialog.modalEl.css('marginLeft');
        if (marginLeft == "")
          return;
        marginLeft = parseInt(marginLeft, 10);

        scope.dialog.modalEl.removeAttr("style");

        var winSize = {
          w: $(window).width(),
          h: $(window).height()
        };

        if (pos == 'original') {
          scope.dialog.modalEl.offset({
            left: winSize.w / 2 + marginLeft,
            top: winSize.h / 10
          });
        } else if (pos == 'corner') {
          var dlgWidth = scope.dialog.modalEl.width();
          scope.dialog.modalEl.offset({
           left: winSize.w - dlgWidth - 30,
           top: winSize.h - 200
          });
        } else {
          throw new Error("invalid dialog position");
        }
      });
    }
  };
});

// Highlight step dialog UI.
// Make squares, remove then and draw them to the canvas in the final step.
