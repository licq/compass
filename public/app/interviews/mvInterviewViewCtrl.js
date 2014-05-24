'use strict';

angular.module('compass')
    .controller('mvInterviewViewCtrl', function ($scope, $routeParams, $location, $http, mvIdentity, mvInterview, mvNotifier) {

        mvInterview.get({_id: $routeParams.id}, function (interview) {
            $scope.interview = interview;
            $scope.crumbs = [
                {
                    text: '待评价',
                    url: 'interviews/unprocessed'
                },
                {
                    text: interview.name,
                    url: interview._id
                }
            ];

            $scope.name = interview.name;
            $scope.applyPosition = interview.applyPosition;
            $scope.reviews = interview.reviews;
            if ($routeParams.isWriteReview) {
                $scope.isWriteReview = true;
            }

        });

        $scope.saveReview = function () {

            var newReview = {
                interviewer: mvIdentity.currentUser._id,
                score: 9,
                comment: $scope.comment,
                qualified: true
            };
            var foundInterviewer = false;
            angular.forEach($scope.interview.reviews, function (review, index) {
                if (review.interviewer === newReview.interviewer) {
                    $scope.interview.reviews[index] = newReview;
                    foundInterviewer = true;
                    return false;
                }
            });
            if (!foundInterviewer) {
                $scope.interview.reviews.push(newReview);
            }
            $http.put('/api/interviews/' + $scope.interview._id, {review: newReview})
                .success(function () {
                    mvNotifier.notify('评价保存成功');
                })
                .error(function () {
                    mvNotifier.error('评价保存失败');
                });
        };

        $scope.deleteReview = function (reviewId) {
            $http.put('/api/interviews/' + $scope.interview._id, {reviewToDelete: reviewId})
                .success(function () {
                    mvNotifier.notify('评价删除成功');
                })
                .error(function () {
                    mvNotifier.error('评价删除失败');
                });
        };

        $scope.newReview = function () {
            $scope.isWriteReview = true;
        };

        $scope.cancel = function () {
            $location.path('/interviews/unprocessed');
        };
    });