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

    describe('yearAndMonth', function () {
        it('should return correctly', inject(function (yearAndMonthFilter) {
            expect(yearAndMonthFilter(new Date(2011, 9, 20))).to.equal('2011年10月');
        }));
    });

    describe('shortDate', function () {
        it('should return correctly', inject(function (shortDateFilter) {
            expect(shortDateFilter(new Date(2011, 9, 20))).to.equal('2011年10月20日');
        }));
    });

    describe('longDate', function () {
        it('should return correctly', inject(function (longDateFilter) {
            expect(longDateFilter(new Date(2011, 9, 20, 5, 25, 5))).to.equal('2011年10月20日 05:25:05');
        }));
    });

    describe('yearsOfExperience', function () {
        it('should return correctly', inject(function (yearsOfExperienceFilter) {
            expect(yearsOfExperienceFilter(2)).to.equal('2年');
            expect(yearsOfExperienceFilter(0)).to.equal('应届毕业生');
            expect(yearsOfExperienceFilter(-1)).to.equal('学生');
        }));
    });


});