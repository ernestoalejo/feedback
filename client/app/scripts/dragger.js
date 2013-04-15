'use strict';



/**
 * Configures a dialog for drag and drop.
 * @param {Element} modalEl The DIV root element of the dialog.
 * @constructor
 */
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


/**
 * Bind all needed events.
 */
Dragger.prototype.bind = function() {
  this.$document_.bind('mousedown', this.downFunc_);
  this.$document_.bind('mousemove', this.moveFunc_);
  this.$window_.bind('mouseup', this.upFunc_);
};


/**
 * Unbind the dialog events.
 */
Dragger.prototype.unbind = function() {
  this.$document_.unbind('mousedown', this.downFunc_);
  this.$document_.unbind('mousemove', this.moveFunc_);
  this.$window_.unbind('mouseup', this.upFunc_);
};


/**
 * Called each time the mouse is pressed inside the document.
 * @param  {Event} event The pressed event.
 * @return {boolean} False if the event should be stopped.
 * @private
 */
Dragger.prototype.down_ = function(event) {
  // Left mouse button only
  if (event.which != 1)
    return true;

  // Ignore events when clicking the close cross.
  var t = $(event.target);
  if (t.hasClass('close'))
    return true;

  // Check if we're inside the header or footer elements (content will have
  // and additional layer before reaching the root).
  if (!t.hasClass('modal'))
    t = t.parent();
  if (!t.hasClass('modal'))
    t = t.parent();
  if (!t.hasClass('modal'))
    return true;

  // Remove the class to avoid strange transitions while moving the dialog
  this.dragging_ = true;
  this.modalEl_.removeClass('fade');

  // Account the mouse offset to keep it constant while we're dragging.
  this.offset_ = this.modalEl_.offset();
  this.offset_.left = event.pageX - this.offset_.left;
  this.offset_.top = event.pageY - this.offset_.top;

  return false;
};


/**
 * Called each time the mouse moves in the document.
 * @param  {Event} event The move event.
 * @return {boolean} False if the event should be stopped.
 * @private
 */
Dragger.prototype.move_ = function(event) {
  // Ignore the event if we're not dragging the dialog
  if (!this.dragging_)
    return true;

  this.modalEl_.offset({
    left: event.pageX - this.offset_.left,
    top: event.pageY - this.offset_.top
  });
};


/**
 * Called each time the mouse is released.
 * @param  {Event} event The release event.
 * @return {boolean} False if the event should be stopped.
 * @private
 */
Dragger.prototype.up_ = function(event) {
  // Ignore the event if we're not dragging the dialog
  if (!this.dragging_)
    return true;

  // Restore the original dialog properties
  this.dragging_ = false;
  this.modalEl_.addClass('fade');
};
