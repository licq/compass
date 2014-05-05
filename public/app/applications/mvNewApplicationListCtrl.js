angular.module('compass')
    .controller('mvNewApplicationListCtrl', function ($scope, states, mvApplication, $http, $window) {
        $scope.crumbs = [
            {
                text: '新应聘',
                url: '/applications/new'
            }
        ];
        states.defaults('mvNewApplicationListCtrl', {
            pagingOptions: {
                pageSizes: [10, 20, 50],
                pageSize: 50,
                currentPage: 1
            },
            searchOptions: {
            }
        });

        $scope.currentPage = 3;

        $scope.states = states.get('mvNewApplicationListCtrl');
        $scope.totalApplicationCount = 0;

        $scope.getApplications = function () {
            var query = angular.extend({pageSize: $scope.states.pagingOptions.pageSize,
                    page: $scope.states.pagingOptions.currentPage,
                    status: 'new'},
                $scope.states.searchOptions);
            $http.get('/api/applications', {params: query}).success(function (result) {
                $scope.totalApplicationCount = result.hits.total;
                $scope.applications = result.hits.hits;
                $scope.facets = result.facets;
            });
        };

        function getOneMoreApplication() {
            if ($scope.totalApplicationCount > $scope.states.pagingOptions.currentPage * $scope.states.pagingOptions.pageSize) {
                var query = angular.extend({pageSize: 1,
                        page: $scope.states.pagingOptions.currentPage * $scope.states.pagingOptions.pageSize,
                        status: 'new'},
                    $scope.states.searchOptions);

                $http.get('/api/applications', {params: query}).success(function (result) {
                    if (result.hits.hits && result.hits.hits.length > 0) {
                        $scope.applications.push(result.hits.hits[0]);
                    }
                });
            }
        }

        $scope.getApplications();

        $scope.setApplyPosition = function (applyPosition) {
            $scope.states.searchOptions.applyPosition = applyPosition;
            $scope.states.pagingOptions.currentPage = 1;
            $scope.getApplications();
        };

        $scope.setAge = function (age) {
            $scope.states.searchOptions.age = age;
            $scope.states.pagingOptions.currentPage = 1;
            $scope.getApplications();
        };

        $scope.setHighestDegree = function (highestDegree) {
            $scope.states.searchOptions.highestDegree = highestDegree;
            $scope.states.pagingOptions.currentPage = 1;
            $scope.getApplications();
        };

        $scope.showPagination = function () {
            return $scope.totalApplicationCount > $scope.states.pagingOptions.pageSize;
        };

        $scope.pageChanged = function () {
            $scope.states.pagingOptions.currentPage = $scope.currentPage;
            $scope.getApplications();
        };

        function removeFromApplications(id) {
            var index = -1;
            angular.forEach($scope.applications, function (application, i) {
                if (application._id === id) {
                    index = i;
                }
            });

            if (index > -1) {
                $scope.applications.splice(index, 1);
                $scope.totalApplicationCount -= 1;
            }
        }

        $scope.archive = function (id) {
            if ($window.confirm('确认将该应聘简历归档？归档后的简历可在人才库找到')) {
                mvApplication.archive({_id: id}, function () {
                    removeFromApplications(id);
                    getOneMoreApplication();
                });
            }
        };

        $scope.pursue = function(id){
            mvApplication.pursue({_id: id}, function() {
                removeFromApplications(id);
                getOneMoreApplication();
            });
        };

        $scope.undetermine = function(id){
            mvApplication.undetermine({_id: id}, function() {
                removeFromApplications(id);
                getOneMoreApplication();
            });
        };
    });