angular.module('compass')
    .controller('mvCompanyListCtrl', function ($scope, mvCompany, $location) {
        $scope.crumbs = [
            {text: '公司', url: 'companies'}
        ];
        $scope.companies = mvCompany.query();

        $scope.gridOptions = angular.extend({
            data: 'companies',
            columnDefs: [
                {field: 'name', displayName: '名称'},
                {field: 'created_at', displayName: '创建时间', cellFilter: 'date:"yyyy/MM/dd HH:mm:ss"'}
            ]
        }, $scope.gridDefaults);

        $scope.remove = function () {
            var index = this.row.rowIndex;
            var company = $scope.companies[index];
            if (confirm('真的要删除' + company.name + '吗？')) {
                company.$delete(function () {
                    company.deleted = true;
                });
            }
        };

        $scope.edit = function () {
            var index = this.row.rowIndex;
            $location.path('/companies/edit/' + $scope.companies[index]._id);
        };
    });