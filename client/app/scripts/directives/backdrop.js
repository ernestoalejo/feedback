'use strict';

var m = angular.module('directives.backdrop', ['directives.dnd']);


m.directive('backdropOpacity', function($parse) {
  return {
    restrict: 'EA',
    require: 'dndModal',
    link: function(scope, elm, attrs) {
      scope.$watch(attrs.backdropOpacity, function(expr, oldExpr) {
        if (!scope.dialog)
          return;
        scope.dialog.backdropEl.css('opacity', expr ? 0.3 : 0.8);
      });
    }
  };
});


m.directive('dialogPosition', function($parse) {
  return {
    restrict: 'EA',
    require: 'dndModal',
    link: function(scope, elm, attrs) {
      scope.$watch(attrs.dialogPosition, function(pos, oldPos) {
        if (!scope.dialog)
          return;

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
           top: winSize.h - 336
          });
        } else {
          throw new Error("invalid dialog position");
        }
      });
    }
  };
});


m.directive('backdropDrawable', function($parse) {
  return {
    restrict: 'EA',
    require: 'dndModal',
    link: function(scope, elm, attrs) {
      scope.$watch(attrs.backdropDrawable, function(drawable, old) {
        if (!scope.dialog)
          return;

        scope.operation = 'highlight';

        if (drawable) {
        } else {
        }
      });
    }
  };
});

// Wider dialogs.
// Make squares, remove then and draw them to the canvas in the final step.
