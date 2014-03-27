describe('filters', function () {
    beforeEach(module('compass'));

    describe('state', function () {
        it('should return correctly', inject(function (stateFilter) {
            expect(stateFilter()).to.equal('正常');
            expect(stateFilter('connect failed')).to.equal('服务器无法连接');
            expect(stateFilter('login failed')).to.equal('用户名或密码不正确');
        }));
    });

    describe('deletedState', function () {
        it('should return correctly', inject(function (deletedStateFilter) {
            expect(deletedStateFilter(false)).to.equal('正常');
            expect(deletedStateFilter(true)).to.equal('已删除');
        }));
    });
});