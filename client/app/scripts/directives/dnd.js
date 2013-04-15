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
      scope.$watch(shownExpr, function(isShown, oldShown) {
        if (isShown) {
          dialog.open().then(function() {
            $parse(attrs.close)(scope);
          });
        } else {
          if (dialog.isOpen())
            dialog.close();
        }
      });

      var dragging = false;
      var offset = {top: 0, left: 0};

      var $document = $(document);
      var $window = $(window);
      $document.bind('mousedown', function(event) {
        if (event.which != 1) // left mouse button
          return true;

        var t = $(event.target);
        if (t.hasClass('close'))
          return true;
        if (!t.hasClass('modal'))
          t = t.parent();
        if (!t.hasClass('modal'))
          t = t.parent();
        if (!t.hasClass('modal'))
          return true;

        dragging = true;
        dialog.modalEl.removeClass('fade');
        offset = dialog.modalEl.offset();
        offset.left = event.pageX - offset.left;
        offset.top = event.pageY - offset.top;

        return false;
      });
      $document.bind('mousemove', function(event) {
        if (!dragging)
          return true;

        dialog.modalEl.offset({
          left: event.pageX - offset.left,
          top: event.pageY - offset.top
        });
      });
      $window.bind('mouseup', function(event) {
        if (!dragging)
          return true;

        dragging = false;
        dialog.modalEl.addClass('fade');
      });
    }
  };
});

// Lighter backdrop.
// Unbind dnd events.
// Añadirle la UI del highlight step.
// Hacer selecciones, borrarlas e incorporarlas al canvas.
