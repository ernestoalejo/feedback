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
    }
  };
});

// Lighter backdrop.
// Mover el diálogo a la esquina correcta.
// Añadirle la UI del highlight step.
// Hacer selecciones, borrarlas e incorporarlas al canvas.
