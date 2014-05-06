angular.module('compass')
    .controller('mvNewApplicationViewCtrl', function ($scope, mvApplication, $routeParams, states, $http, $window, mvNotifier) {
        $scope.index = $routeParams.index;
        if (states.get('mvNewApplicationListCtrl')) {
            $scope.searchOptions = states.get('mvNewApplicationListCtrl').searchOptions;
        }

        function retrieveApplication() {
            var queryConditions = angular.extend({
                pageSize: 1,
                page: $scope.index,
                status: 'new'
            }, $scope.searchOptions);

            $http.get('/api/applications', {params: queryConditions}).success(function (result) {
                if (result.hits && result.hits.hits && result.hits.hits.length === 1) {
                    $scope.totalApplicationCount = result.hits.total;
                    $scope.resume = result.hits.hits[0];
                    $scope.crumbs = [
                        {text: '新应聘', url: 'applications/new'},
                        {text: $scope.resume.name, url: $scope.resume._id}
                    ];
                    $window.scrollTo(0, 0);
                }
            });
        }

        retrieveApplication();
        $scope.selectMail = function () {
            $scope.mailHtml = $scope.mailHtml || '/api/mails/' + $scope.resume.mail + '/html';
        };

        $scope.pursue = function () {
            mvApplication.pursue({_id: $scope.resume._id}, function () {
                mvNotifier.notify('已将' + $scope.resume.name + '加入面试列表');
                retrieveApplication();
            });
        };
    });