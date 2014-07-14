describe('mvPositionListCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    mvPositionListCtrl,
    $scope;

  beforeEach(inject(function (_$httpBackend_, $rootScope, $controller) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/positions').respond(function () {
      return [200, [{
        name: 'cio',
        department:'技术部',
        interviewers: ['张三', '李四'],
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
        ]}]

      ];
    });

    $scope = $rootScope.$new();
    mvPositionListCtrl = $controller('mvPositionListCtrl', {
      $scope: $scope
    });
  }));

  it('should get the position list', function () {
    $httpBackend.flush();
    expect($scope.positions).to.have.length(1);
  });
});
