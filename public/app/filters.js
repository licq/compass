'use strict';

app.filter('state',function(){
    return function(input){
        if(input) return '正常';
        return '异常';
    }
});