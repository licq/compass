describe('mvInterviewViewCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    $scope;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
    $scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $controller('mvInterviewViewCtrl', {
      $scope: $scope,
      $routeParams: {id: '7788'},
      mvIdentity: {
        currentUser: {
          _id: '112',
          name: '包拯'
        }
      }
    });

    $httpBackend.expectGET('/api/interviews/7788').respond({
      _id: '7788',
      name: '张三',
      applyPosition: 'cio',
      reviews: [
        {
          interviewer: {
            _id: '112'
          },
          items: [
            {name: '学习能力', rate: 1, score: 4},
            {name: '工作态度', rate: 1, score: 3},
            {name: '团队合作', rate: 1, score: 5},
            {name: '沟通能力', rate: 1, score: 5}
          ]
        }
      ]
    });
    $httpBackend.flush();
  }));

  it('should return an interview', function () {
    expect($scope.interview).to.exist;
    expect($scope.interview).to.have.property('name');
  });

  it('should set reviewTable', function () {
    expect($scope.reviewHeader).to.deep.equal(
      ['学习能力', '工作态度', '团队合作', '沟通能力']);
    expect($scope.reviewData).to.deep.equal({
      '112': {
        '学习能力': 4,
        '工作态度': 3,
        '团队合作': 5,
        '沟通能力': 5
      }
    });
  });

  it('should go to /interviews/list', inject(function ($location) {
    var spy = sinon.spy($location, 'path');
    $scope.cancel();
    expect(spy).to.have.been.calledWith('/interviews/list');
  }));
});