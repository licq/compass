'use strict';

(function() {
    describe('Compass controllers', function() {
        describe('HeaderController', function() {
            // Load the controllers module
            beforeEach(module('compass'));

            var scope, HeaderController;

            beforeEach(inject(function($controller, $rootScope) {
                scope = $rootScope.$new();

                HeaderController = $controller('HeaderController', {
                    $scope: scope
                });
            }));

            it('should expose some global scope', function() {

                expect(scope.global).toBeTruthy();

            });
        });
    });
})();