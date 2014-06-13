angular.module('compass')
  .controller('mvRoleListCtrl', function ($scope, mvRole, $location) {
    $scope.roles = mvRole.query();

    $scope.gridOptions = angular.extend({
      data: 'roles',
      columnDefs: [
        {field: 'name', displayName: '角色'},
        {field: 'createdAt', displayName: '创建时间', cellFilter: 'date:"yyyy/MM/dd HH:mm:ss"'},
        {field: 'actions',
          displayName: '操作',
          sortable: false,
          cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">' +
            '<edit-button action="edit(row)"></edit-button>' +
            '<delete-button action="remove(row)"></delete-button>' +
            '</div>'}
      ]
    }, $scope.gridDefaults);

    $scope.remove = function (role) {
      if (confirm('真的要删除' + role.name + '吗？')) {
        role.$delete();
      }
    };

    $scope.edit = function (role) {
      $location.path('/settings/roles/edit/' + role._id);
    };
  });