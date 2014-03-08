app.controller('EmailListController', function ($scope) {
    $scope.myData = [
        {"email": "job@jinjiang.com", "totalResumes": 43, "lastTime": "2013-4-30", "active": true},
        {"email": "job@jinjiang.com", "totalResumes": 42, "lastTime": "2013-3-30", "active": false},
        {"email": "job@jinjiang.com", "totalResumes": 40, "lastTime": "2013-2-30", "active": true},
        {"email": "job@jinjiang.com", "totalResumes": 22, "lastTime": "2013-1-30", "active": true}
    ];
    $scope.gridOptions = {
        multiSelect: false,
        data: 'myData',
        headerRowHeight: 40,
        rowHeight: 40,
        showFooter: true,
        i18n: 'zh-cn',
        columnDefs: [
            {field: 'email', displayName: 'Email'},
            {field: 'totalResumes', displayName: '共收取简历数'},
            {field: 'lastTime', displayName: '上次收取时间'},
            {field: 'active',
                displayName: '状态',
                cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span class="label" ' +
                    'ng-class="{\'label-success\': row.getProperty(col.field), \'label-danger\': !row.getProperty(col.field)}">' +
                    '{{row.getProperty(col.field) | state}}</span></div>'},
            {field: 'actions',
                displayName: '操作',
                cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><button class="btn btn-xs btn-warning"><i class="fa fa-pencil"></i></button>' +
                    '<button class="btn btn-xs btn-danger" ng-click="remove(row)"><i class="fa fa-times"></i></button></div>'}
        ]
    };

    $scope.remove = function (row) {
        var index = $scope.myData.indexOf(row.entity);
        if (confirm('真的要删除' + $scope.myData[index].email + '吗？')) {
            $scope.myData.splice(index, 1);
        }
    };
});