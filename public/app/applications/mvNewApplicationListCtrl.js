angular.module('compass')
    .controller('mvNewApplicationListCtrl', function ($scope, states, mvApplication, $http) {
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

        $scope.showPagination = function(){
            return $scope.totalApplicationCount > $scope.states.pagingOptions.pageSize;
        };

        $scope.pageChanged = function(){
            $scope.states.pagingOptions.currentPage = $scope.currentPage;
            $scope.getApplications();
        };
    });