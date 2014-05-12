angular.module('compass')
  .controller('mvUserListCtrl', function ($scope, mvUser, $location) {
    $scope.crumbs = [
      {text: '用户', url: 'users'}
    ];
    $scope.users = mvUser.query();

    $scope.gridOptions = angular.extend({
      data: 'users',
      columnDefs: [
        {field: 'name', displayName: '姓名'},
        {field: 'email', displayName: '邮箱'},
        {field: 'title', displayName: '职位'},
        {field: 'created_at', displayName: '创建时间', cellFilter: 'date:"yyyy/MM/dd HH:mm:ss"'},
        {field: 'deleted',
          displayName: '状态',
          cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"> ' +
            '<status-span value="row.getProperty(col.field)">{{row.getProperty(col.field) | deletedState }}</status-span>' +
            '</div>'},
        {field: 'actions',
          displayName: '操作',
          sortable: false,
          cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">' +
            '<edit-button action="edit(row)"></edit-button>' +
            '<delete-button action="remove(row)"></delete-button>' +
            '</div>'}
      ]
    }, $scope.gridDefaults);

    $scope.remove = function (row) {
      var user = row.entity;
      if (confirm('真的要删除' + user.name + '吗？')) {
        user.$delete(function () {
          user.deleted = true;
        });
      }
    };

    $scope.edit = function (row) {
      $location.path('/users/edit/' + row.entity._id);
    };
  });