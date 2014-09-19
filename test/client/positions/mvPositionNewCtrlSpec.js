describe('mvPositionNewCtrl', function () {
  var $httpBackend,
    $scope,
    mvPositionNewCtrl;

  beforeEach(module('compass'));
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $scope = $rootScope.$new();
    $httpBackend.expectGET('/api/positions/toBeAdded').respond(['JAVA工程师', '市场总监']);
    $httpBackend.expectGET('/api/users?deleted=false&fields=name').respond([
      {'_id': '4466', 'name': '张三'},
      {'_id': '5577', 'name': '李四'}
    ]);
    $httpBackend.expectGET('/api/evaluationCriterions').respond({items: [
      {
        name: '英语',
        rate: 0.5
      }
    ]});
    $httpBackend.expectGET('/api/applicationSettings?fields=positionRightControlled').respond({positionRightControlled: false});
    mvPositionNewCtrl = $controller('mvPositionNewCtrl', {
      $scope: $scope
    });
    $httpBackend.flush();
  }));

  describe('create position', function () {
    var postData;
    beforeEach(function () {
      $scope.position.name = 'cio';
      $scope.position.department = 'sales';
      $scope.position.alias = ['cinfoo', 'chiefio'];
      postData = {
        name: 'cio',
        department: 'sales',
        owners: ['4466', '5577'],
        alias: ['cinfoo', 'chiefio'],
        evaluationCriterions: [
          {
            'name': '英语',
            'rate': 0.5
          }
        ]};
    });

    it('should go to success page when create success', inject(function ($location, mvNotifier) {
      $scope.selectAll = true;
      $scope.onSelectAll();
      $httpBackend.expectPOST('/api/positions', postData).respond(200);
      var spy = sinon.spy($location, 'path');
      var notifySpy = sinon.spy(mvNotifier, 'notify');
      $scope.create();
      $httpBackend.flush();
      expect(spy).to.have.been.calledWith('/settings/positions');
      expect(notifySpy).to.have.been.calledWith('添加职位成功');
    }));

    it('should show error if create failed', inject(function (mvNotifier) {
      $scope.selectAll = true;
      $scope.onSelectAll();
      $httpBackend.expectPOST('/api/positions', postData).respond(500, {message: 'error'});
      var notifySpy = sinon.spy(mvNotifier, 'error');
      $scope.create();
      $httpBackend.flush();
      expect(notifySpy).to.have.been.calledWith('添加职位失败');
    }));
  });

  it('should initialize successfully', function () {
    expect($scope.users).to.have.length(2);
    expect($scope.position.evaluationCriterions).to.have.length(1);
  });

  it('should initialize positions', function () {
    expect($scope.positions).to.have.length(2);
  });


  describe('remove', function () {
    it('should remove the corresponding item', function () {
      $scope.remove({
        name: '英语',
        rate: 0.5
      });
      expect($scope.position.evaluationCriterions).to.have.length(0);
    });
  });

  describe('add', function () {
    it('should add set adding to true', function () {
      $scope.add();
      expect($scope.adding).to.equal(true);
    });
  });

  describe('save', function () {
    it('should add one row to items', function () {
      $scope.item = {
        name: '学习能力',
        rate: 3.5
      };
      $scope.save();
      expect($scope.adding).to.equal(false);
      expect($scope.item).to.be.empty;
      expect($scope.position.evaluationCriterions).to.have.length(2);
    });
  });

  describe('cancel', function () {
    it('should change adding to false', function () {
      $scope.adding = true;
      $scope.cancel();
      expect($scope.adding).to.false;
      expect($scope.position.evaluationCriterions).to.have.length(1);
    });
  });

  describe('onSelectAll', function () {
    it('should not check all the users when init', function () {
      expect($scope.selectAll).to.be.false;
    });

    it('should check all the users when select all is checked', function () {
      $scope.selectAll = true;
      $scope.onSelectAll();
      expect(_.all($scope.users, 'checked')).to.be.true;
    });

    it('should check all the users when select all is not checked', function () {
      $scope.selectAll = false;
      $scope.onSelectAll();
      expect(_.some($scope.users, 'checked')).to.be.false;
    });
  });

  describe('loadPositions', function () {
    it('should simulate promise', inject(function () {
      var promise = $scope.loadPositions('场总');
      var resolvedValue;

      promise.then(function (value) {
        resolvedValue = value;
        expect(resolvedValue).toEqual(['市场总监']);
      });
    }));
  });

  describe('onSelectUser', function () {
    it('should set selectAll to true when one user is not checked', function () {
      $scope.selectAll = true;
      $scope.onSelectAll();
      $scope.users[$scope.users.length - 1].checked = false;
      $scope.onSelectUser();
      expect($scope.selectAll).to.be.false;
    });

    it('should set selectAll to true when all users are checked', function () {
      $scope.selectAll = false;
      _.forEach($scope.users, function (user) {
        user.checked = true;
        $scope.onSelectUser();
      });
      expect($scope.selectAll).to.be.true;
    });
  });
});
