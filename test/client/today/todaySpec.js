describe('Homepage', function () {
  beforeEach(module('compass'));
  var $httpBackend, $scope;
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, mvReview, mvIdentity) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    mvIdentity.currentUser = {_id: '7788'};
    $controller('mvTodayCtrl', {
      $scope: $scope
    });

    $httpBackend.expectGET(/^\/api\/events\?endTime=\d.{22}Z&startTime=\d.{22}Z&user=7788/)
      .respond(200, [
        {'name': '张三', 'applyPosition': 'Java软件工程师-上海', 'application': '5566', 'createdBy': '7788', 'startTime': moment().endOf('day').toISOString(), 'duration': 60, 'interviewers': ['7788']},
        {'name': '张二', 'applyPosition': 'Java软件工程师-上海', 'application': '5566', 'createdBy': '7788', 'startTime': moment().add(2, 'd').endOf('day').toISOString(), 'duration': 60, 'interviewers': ['7788']}
      ]);

    $httpBackend.expectGET('/api/reviews?orderBy=events%5B0%5D.startTime&orderByReverse=false&unreviewed=true')
      .respond(200, [
        {'_id': '1122', 'name': '张三', 'applyPosition': 'Java软件工程师-上海', 'reviews': [],
          'events': [
            {'duration': 60, 'startTime': '2014-06-06T15:55:00.000Z', 'createdBy': '7788', 'interviewers': ['7788']}
          ]}
      ]);

    $httpBackend.expectGET(/^\/api\/interviews\?endDate=\d.{22}Z&startDate=\d.{22}Z&status=offer\+accepted/)
      .respond(200, [
        {'name': '张二', 'applyPosition': 'Java软件工程师-上海', 'onboardDate': moment().add('day', 2).endOf('day').toISOString()},
        {'name': '张五', 'applyPosition': 'Java软件工程师-上海', 'onboardDate': moment().endOf('day').toISOString()}
      ]);
    $scope.counts = {};
    $httpBackend.flush();
  }));

  it('should return interview list', function () {
    expect($scope.eventsOfToday).to.have.length(1);
    expect($scope.eventsOfNextDays).to.have.length(1);
  });

  it('should get back unreviewed list Of today', function () {
    expect($scope.unreviewedOfDays).to.have.length(1);
    expect($scope.unreviewedOfDays[0].name).to.equal('张三');
    expect($scope.unreviewedOfDays[0]._id).to.equal('1122');
    expect($scope.unreviewedOfDays[0].applyPosition).to.equal('Java软件工程师-上海');
    expect($scope.unreviewedOfDays[0].events[0].startTime).to.equal('2014-06-06T15:55:00.000Z');
  });

  it('should get back onboards list', function () {
    expect($scope.onboardsOfToday).to.have.length(1);
    expect($scope.onboardsOfNextDays).to.have.length(1);
  });
});

