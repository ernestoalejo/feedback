'use strict';

var m = angular.module('directives.dnd', ['ui.bootstrap.dialog']);


m.directive('dndModal', function($parse, $dialog) {
  return {
    restrict: 'EA',
    controller: function() { },
    terminal: true,
    link: function(scope, elm, attrs) {
      var opts = scope.$eval(attrs.options);
      var shownExpr = attrs.dndModal;

      opts = angular.extend(opts, {
        template: elm.html(),
        resolve: { $scope: function() { return scope; }}
      });
      elm.remove();

      scope.dialog = $dialog.dialog(opts);

      var dragger = new Dragger(scope.dialog.modalEl);
      scope.$watch(shownExpr, function(isShown, oldShown) {
        if (isShown) {
          dragger.bind();
          scope.dialog.open().then(function() {
            dragger.unbind();
            $parse(attrs.close)(scope);
          });
        } else {
          if (scope.dialog.isOpen()) {
            dragger.unbind();
            scope.dialog.close();
          }
        }
      });
    }
  };
});
