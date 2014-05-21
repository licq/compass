describe('mvInterviewListCtrl', function () {
  beforeEach(module('compass'));

  var $scope,
    $httpBackend;

  beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    $httpBackend.expectGET('/api/interviews?status=unprocessed')
      .respond([
        {
          name: 'user1',
          applyPosition: 'cio',
          reviews: [
            {
              startTime: '2014-5-18 15:00',
              interviewer: {
                _id: '7788',
                name: 'user1'
              },
              qualified: true,
              skill: 9,
              knowledge: 8
            }
          ]
        }
      ]);

    $controller('mvInterviewListCtrl',
      {
        $scope: $scope
      });

    $httpBackend.flush();

  }));


  describe('/interviews?status=unprocessed', function () {
    it('should show a list of interviews correctly', function () {
      expect($scope.interviews).to.have.length(1);
    });
  });
});