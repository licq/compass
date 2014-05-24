describe('mvInterviewViewCtrlSpec', function () {

  beforeEach(module('compass'));

  var $httpBackend,
    $scope;

  describe('isNewReview is false', function () {
    beforeEach(inject(function ($rootScope, _$httpBackend_, $controller) {
      $scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      $controller('mvInterviewViewCtrl', {
        $scope: $scope,
        $routeParams: {id: '7788', isNewReview: false},
        mvIdentity: {
          currentUser: {
            _id: '7788',
            name: '包拯'
          }
        }
      });

      $httpBackend.expectGET('/api/interviews/7788').respond({   _id: '7788',
        name: '张三',
        applyPosition: 'cio',
        reviews: []
      });
      $httpBackend.flush();
    }));


    it('should show title correctly', function () {
      expect($scope.title).to.equal('张三');
    });

    it('should return an interview', function () {
      expect($scope.interview).to.exist;
      expect($scope.interview).to.have.property('name');
    });

    it('should go to /interviews/unprocessed', inject(function ($location) {
      var spy = sinon.spy($location, 'path');
      $scope.backToList();
      expect(spy).to.have.been.calledWith('/interviews/unprocessed');
    }));

    describe('newReview', function () {
      beforeEach(function () {
        $httpBackend.expectGET('/api/evaluationCriterions').respond({
          items: [
            {name: '学习能力', rate: 1},
            {name: '工作态度', rate: 1},
            {name: '团队合作', rate: 1},
          ]});
        $scope.newReview();
        $httpBackend.flush();
      });

      it('should initialize review', function () {
        expect($scope.isNewReview).to.be.true;
        expect($scope.review).to.deep.equal({
          items: [
            {name: '学习能力', rate: 1},
            {name: '工作态度', rate: 1},
            {name: '团队合作', rate: 1},
          ],
          totalScore: 0});
      });

      it('should set isNewReview = false', function () {
        $scope.cancel();
        expect($scope.isNewReview).to.be.false;
      });

      it('should create review correctly', inject(function (mvNotifier) {
        //todo: totalScore is wrong
        $httpBackend.expectPUT('/api/interviews/7788', {
          review: {
            items: [
              { name: '学习能力', rate: 1, score: 4 },
              {name: '工作态度', rate: 1, score: 3},
              {name: '团队合作', rate: 1, score: 5}
            ],
            totalScore: 0,
            comment: 'This guy is awesome!!!',
            qualified: true
          }
        }).respond(200);
        var spy = sinon.spy(mvNotifier, 'notify');

        $scope.review.items[0].score = 4;
        $scope.review.items[1].score = 3;
        $scope.review.items[2].score = 5;
        $scope.review.comment = 'This guy is awesome!!!';
        $scope.saveReview(true);

        $httpBackend.flush();
        expect(spy).have.been.calledWith('评价保存成功');
        expect($scope.isNewReview).to.equal(false);
        expect($scope.interview.reviews).to.have.length(1);
        expect($scope.interview.reviews[0].interviewer).to.have.property('name', '包拯');
        expect($scope.interview.reviews[0].interviewer).to.have.property('_id', '7788');
      }));
    });
  });

  describe('isNewReview true', function () {
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
              _id: '8899',
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

      $controller('mvInterviewViewCtrl', {
        $scope: $scope,
        $routeParams: {id: '7788', isNewReview: true},
        mvIdentity: {
          currentUser: {
            _id: '7788',
            name: '包拯'
          }
        }
      });
      $httpBackend.flush();
    }));

    it('should set isNewReview to true', function () {
      expect($scope.isNewReview).to.equal(true);
      expect($scope.review.items).to.have.length(3);
    });

    it('should set tableheadings', function () {
      expect($scope.reviewHeader).to.deep.equal(
        ['学习能力', '工作态度', '团队合作', '沟通能力']);
      expect($scope.reviewData).to.deep.equal({
        '8899': {
          '学习能力': 4,
          '工作态度': 3,
          '团队合作': 5,
          '沟通能力': 5
        }
      });
    });
  });

  describe.skip('others', function () {
    it('should show err message when save failed', inject(function (mvNotifier) {
      $httpBackend.expectPUT('/api/interviews/7788').respond(500, {message: 'error'});
      var spy = sinon.spy(mvNotifier, 'error');
      $scope.saveReview();

      $httpBackend.flush();
      expect(spy).have.been.calledWith('评价保存失败');
    }));

    it('should delete review correctly', inject(function (mvNotifier) {
      $httpBackend.expectPUT('/api/interviews/7788').respond(200);
      var spy = sinon.spy(mvNotifier, 'notify');
      $scope.deleteReview('1122');

      $httpBackend.flush();
      expect(spy).have.been.calledWith('评价删除成功');
    }));

    it('should show err message when delete failed', inject(function (mvNotifier) {
      $httpBackend.expectPUT('/api/interviews/7788').respond(500, {message: 'error'});
      var spy = sinon.spy(mvNotifier, 'error');
      $scope.deleteReview('1122');

      $httpBackend.flush();
      expect(spy).have.been.calledWith('评价删除失败');
    }));
  });
})
;