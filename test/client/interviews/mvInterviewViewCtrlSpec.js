describe('mvInterviewViewCtrlSpec', function () {

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
                    _id: '7788'
                }
            }
        });



        $httpBackend.expectGET('/api/interviews/7788')
            .respond(
            {   _id: '7788',
                name: '张三',
                applyPosition: 'cio',
                reviews: []
            });

        $httpBackend.flush();
    }));


//    it('should show crumbs correctly', function () {
//        expect($scope.crumbs).to.deep.equal({text: '详细信息', url: '/interviews/detail'});
//    })

    it('should show crumbs', function () {
        expect($scope.crumbs).to.have.length(2);
        expect($scope.crumbs[0]).to.deep.equal({
            text: '待评价',
            url: 'interviews/unprocessed'
        });
        expect($scope.crumbs[1]).to.deep.equal({
            text: $scope.interview.name,
            url: $scope.interview._id
        });
    });

    it('should return an interview', function () {
        expect($scope.interview).to.have.property('name');
        expect($scope.interview).to.exist;
    });

    it('should update reviews correctly',
        inject(
            function (mvNotifier) {
                $httpBackend.expectPUT('/api/interviews/7788').respond(200);
                var spy = sinon.spy(mvNotifier, 'notify');
                $scope.saveReview();

                $httpBackend.flush();
                expect(spy).have.been.calledWith('评价保存成功');
            })
    );

    it('should show err message when save failed',
        inject(
            function (mvNotifier) {
                $httpBackend.expectPUT('/api/interviews/7788').respond(500, {message: 'error'});
                var spy = sinon.spy(mvNotifier, 'error');
                $scope.saveReview();

                $httpBackend.flush();
                expect(spy).have.been.calledWith('评价保存失败');
            })
    );

    it('should update reviews correctly',
        inject(
            function (mvNotifier) {
                $httpBackend.expectPUT('/api/interviews/7788').respond(200);
                var spy = sinon.spy(mvNotifier, 'notify');
                $scope.deleteReview('1122');

                $httpBackend.flush();
                expect(spy).have.been.calledWith('评价删除成功');
            })
    );

    it('should show err message when delete failed',
        inject(
            function (mvNotifier) {
                $httpBackend.expectPUT('/api/interviews/7788').respond(500, {message: 'error'});
                var spy = sinon.spy(mvNotifier, 'error');
                $scope.deleteReview('7788');

                $httpBackend.flush();
                expect(spy).have.been.calledWith('评价删除失败');
            })
    );
});