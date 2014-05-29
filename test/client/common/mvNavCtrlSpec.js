describe.skip('mvNavCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend, $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope) {

    $httpBackend = _$httpBackend_;
    $scope = $rootScope.new();
  }));

  describe('count of interviews and reviews', function () {
    beforeEach(inject(function ($controller) {
      var mvInterview = $controller('mvInterview', {
        $scope: $scope
      });
    }));
    it('should get interviews count correctly', function () {
      $httpBackend.expectGET('/api/interviews')
        .respond(function(){
          return null;
        });
    });

    it('should get count of reviews correctly', function () {

    });

  });

  it('should get count of new applicationscorrectly', function () {

  });

  it('should get count of undetermined applicationscorrectly', function () {

  });

  it('should get count of pursued applications correctly', function () {

  });

  it('should get count of events on today correctly', function () {

  });

});