describe('filters',function(){
    beforeEach(module('compass'));

    describe('state',function(){
        it('should return correctly', inject(function(stateFilter){
            expect(stateFilter(true)).to.equal('正常');
            expect(stateFilter(false)).to.equal('异常');
        }));
    });
});