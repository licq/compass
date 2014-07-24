describe('mvPositionListCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    mvPositionListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/api/positions/toBeAdded').respond(['咨询师','小秘']);
    $httpBackend.expectGET('/api/positions').respond(function () {
      return [200, [
        {
          name: 'cio',
          department: '技术部',
          owners: ['张三', '李四'],
          evaluationCriterions: [
            {
              'name': '专业知识',
              'rate': 1
            },
            {
              'name': '工作能力',
              'rate': 1
            },
            {
              'name': '工作态度',
              'rate': 1
            },
            {
              'name': '主动性',
              'rate': 1
            },
            {
              'name': '学习能力',
              'rate': 1
            },
            {
              'name': '团队合作',
              'rate': 1
            }
          ]}
      ]
      ];
    });

    $httpBackend.expectGET('/api/applicationSettings?fields=positionRightControlled').respond({positionRightControlled: false});

    $scope = $rootScope.$new();
    mvPositionListCtrl = $controller('mvPositionListCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  it('should initialize toBeAddedPositions', function () {
    expect($scope.toBeAddedPositions).to.have.length(2);
  });
  it('should post', function () {
    $httpBackend.expectPOST('/api/applicationSettings', {positionRightControlled: true}).respond(200);
    var notifySpy = sinon.spy($scope, 'checked');
    $scope.settings.positionRightControlled = true;
    $scope.checked();
    $httpBackend.flush();
    expect(notifySpy).to.have.been.called;
  });
  it('should get the position list', function () {
    expect($scope.settings.positionRightControlled).to.be.false;
    expect($scope.positions).to.have.length(1);
  });
});
