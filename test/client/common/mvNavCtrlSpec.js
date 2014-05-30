describe('mvNavCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend, $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();

    $controller('mvNavCtrl', {
      $scope: $scope
    });

    $httpBackend.expectGET('/api/counts')
      .respond({new: 1, undetermined: 2, pursued: 3,
        eventsOfToday: 4, interviews: 5, reviews: 6});
    $httpBackend.flush();

  }));

  it('should get count correctly', function () {
    expect($scope.counts.new).to.equal(1);
    expect($scope.counts.undetermined).to.equal(2);
    expect($scope.counts.pursued).to.equal(3);
    expect($scope.counts.eventsOfToday).to.equal(4);
    expect($scope.counts.interviews).to.equal(5);
    expect($scope.counts.reviews).to.equal(6);
  });

  it('should run tasks repeatedly', inject(function ($interval) {
    var spy = sinon.spy($scope, 'updateNavCounts');

    $httpBackend.expectGET('/api/counts').respond();
    $interval.flush(3000000);
    $httpBackend.flush();
    expect(spy.called).to.be.true;

    $httpBackend.expectGET('/api/counts').respond();
    $interval.flush(3000000);
    $httpBackend.flush();
    expect(spy.called).to.be.true;
  }));
});