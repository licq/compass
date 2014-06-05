describe('mvNavCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend, $scope, $interval;

  beforeEach(inject(function (_$httpBackend_, $rootScope, mvIdentity, $controller, _$interval_) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $interval = _$interval_;

      $httpBackend.expectGET('/api/counts')
        .respond({new: 1, undetermined: 2, pursued: 3,
          eventsOfToday: 4, interviews: 5, toBeReviewed: 6});

      mvIdentity.currentUser = {
        _id: '7788'
      };

      $controller('mvNavCtrl', {
        $scope: $scope
      });

      $httpBackend.flush();
    })
  );

  it('should get count correctly', function () {
    expect($scope.counts.new).to.equal(1);
    expect($scope.counts.undetermined).to.equal(2);
    expect($scope.counts.pursued).to.equal(3);
    expect($scope.counts.eventsOfToday).to.equal(4);
    expect($scope.counts.interviews).to.equal(5);
    expect($scope.counts.toBeReviewed).to.equal(6);
  });

  it('should run tasks repeatedly', function () {
    $httpBackend.expectGET('/api/counts').respond({});
    $interval.flush(310000);
    $httpBackend.flush();
  });
});
