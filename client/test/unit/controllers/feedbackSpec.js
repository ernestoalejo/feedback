'use strict';


describe('Controller: FeedbackCtrl', function() {
  beforeEach(module('feedback'));

  var scope;
  beforeEach(inject(function($injector) {
    var $controller = $injector.get('$controller');
    var $rootScope = $injector.get('$rootScope');

    scope = $rootScope.$new();
    $controller('FeedbackCtrl', {$scope: scope});
  }));
});
