describe('mvReviewNewCtrl', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    $scope;

  describe('I have reviewed this interview', function () {
    beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $controller('mvReviewNewCtrl', {
        $scope: $scope,
        $routeParams: {id: '7788'},
        mvIdentity: {
          currentUser: {
            _id: '112',
            name: '包拯'
          }
        }
      });

      $httpBackend.expectGET('/api/interviews/7788').respond({   _id: '7788',
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

    it('should set isNewReview to false', function () {
      expect($scope.isNewReview).to.be.false;
    });

    it('should not set review', function () {
      expect($scope.review).to.not.exist;
    });

    it('should set tableheadings', function () {
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

    it('should go to /interviews/reviews', inject(function ($location) {
      var spy = sinon.spy($location, 'path');
      $scope.cancel();
      expect(spy).to.have.been.calledWith('/interviews/reviews');
    }));
  });

  describe('I not reviewed the interview', function () {
    beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/api/interviews/7788').respond({_id: '7788',
        name: '张三',
        applyPosition: 'cio',
        reviews: [
          {
            items: [
              {name: '学习能力', rate: 1, score: 4},
              {name: '工作态度', rate: 1, score: 3},
              {name: '团队合作', rate: 1, score: 5},
              {name: '沟通能力', rate: 1, score: 5}
            ],
            interviewer: {
              _id: '223',
              name: 'lisi'
            }}
        ]
      });
      $httpBackend.expectGET('/api/evaluationCriterions').respond({
        items: [
          {name: '学习能力', rate: 1},
          {name: '工作态度', rate: 1},
          {name: '团队合作', rate: 1},
        ]});

      $controller('mvReviewNewCtrl', {
        $scope: $scope,
        $routeParams: {id: '7788'},
        mvIdentity: {
          currentUser: {
            _id: '112',
            name: '包拯'
          }
        }
      });
      $httpBackend.flush();
    }));

    it('should set isNewReview to true', function () {
      expect($scope.isNewReview).to.equal(true);
      expect($scope.review).to.deep.equal({
        items: [
          {name: '学习能力', rate: 1},
          {name: '工作态度', rate: 1},
          {name: '团队合作', rate: 1},
        ],
        totalScore: 0});
    });

    it('should create review correctly', inject(function (mvNotifier) {
      $httpBackend.expectPUT('/api/interviews/7788', {
        review: {
          items: [
            { name: '学习能力', rate: 1, score: 4 },
            {name: '工作态度', rate: 1, score: 3},
            {name: '团队合作', rate: 1, score: 5}
          ],
          totalScore: 12,
          comment: 'This guy is awesome!!!',
          qualified: true
        }
      }).respond(200);
      var spy = sinon.spy(mvNotifier, 'notify');

      $scope.review.items[0].score = 4;
      $scope.review.items[1].score = 3;
      $scope.review.items[2].score = 5;
      $scope.calculateTotalScore();
      $scope.review.comment = 'This guy is awesome!!!';

      $scope.save(true);

      $httpBackend.flush();
      expect(spy).have.been.calledWith('评价保存成功');
      expect($scope.isNewReview).to.equal(false);
      expect($scope.interview.reviews).to.have.length(2);
      expect($scope.interview.reviews[1].interviewer).to.have.property('name', '包拯');
      expect($scope.interview.reviews[1].interviewer).to.have.property('_id', '112');
    }));
  });
})
;