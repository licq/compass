'use strict';

angular.module('compass')
    .controller('mvInterviewListCtrl', function ($scope, mvInterview, $modal, $location) {
        $scope.crumbs = [
            {text: '待评价', url: 'interviews/unprocessed'}
        ];

        $scope.interviews = mvInterview.unprocessed();

        $scope.viewDetail = function (interviewId) {
            $location.path('/interviews/' + interviewId);
        };

        $scope.writeReview = function (interviewId) {
            $location.path('/interviews/' + interviewId).search({isWriteReview: 'true'});
        };

        $scope.newEvent = function (interview) {
            var modalInstance = $modal.open({
                templateUrl: '/app/interviews/eventNew.html',
                controller: 'mvEventNewCtrl',
                resolve: {
                    event: function () {
                        return {
                            name: interview.name,
                            applyPosition: interview.applyPosition,
                            mobile: interview.mobile,
                            email: interview.email,
                            application: interview.application
                        };
                    }
                }});

            modalInstance.result.then(function () {
                mvInterview.get({_id: interview._id}, function (newInterview) {
                    angular.forEach($scope.interviews, function (inter, index) {
                        if (inter._id === newInterview._id) {
                            $scope.interviews[index] = newInterview;
                            return false;
                        }
                    });
                });
            });
        };
    });