'use strict';

var m = angular.module('directives.dnd', ['ui.bootstrap.dialog']);


function Dragger(modalEl) {
  this.modalEl_ = modalEl;

  this.dragging_ = false;
  this.offset_ = {top: 0, left: 0};
  this.$document_ = $(document);
  this.$window_ = $(window);

  this.downFunc_ = angular.bind(this, this.down_);
  this.moveFunc_ = angular.bind(this, this.move_);
  this.upFunc_ = angular.bind(this, this.up_);
}

Dragger.prototype.bind = function() {
  this.$document_.bind('mousedown', this.downFunc_);
  this.$document_.bind('mousemove', this.moveFunc_);
  this.$window_.bind('mouseup', this.upFunc_);
};

Dragger.prototype.unbind = function() {
  this.$document_.unbind('mousedown', this.downFunc_);
  this.$document_.unbind('mousemove', this.moveFunc_);
  this.$window_.unbind('mouseup', this.upFunc_);
};

Dragger.prototype.down_ = function(event) {
  if (event.which != 1) // left mouse button only
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

  this.dragging_ = true;
  this.modalEl_.removeClass('fade');
  this.offset_ = this.modalEl_.offset();
  this.offset_.left = event.pageX - this.offset_.left;
  this.offset_.top = event.pageY - this.offset_.top;

  return false;
};

Dragger.prototype.move_ = function(event) {
  if (!this.dragging_)
    return true;

  this.modalEl_.offset({
    left: event.pageX - this.offset_.left,
    top: event.pageY - this.offset_.top
  });
};

Dragger.prototype.up_ = function(event) {
  if (!this.dragging_)
    return true;

  this.dragging_ = false;
  this.modalEl_.addClass('fade');
};


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
// Añadirle la UI del highlight step.
// Hacer selecciones, borrarlas e incorporarlas al canvas.
