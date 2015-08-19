var jobs = require('./server/tasks/jobs');
var config = require('./server/config/config');
jobs.init(config);
require('./server/config/mongoose')(config);
jobs.recreateAllJobs(function(){
    console.log("create email fetch jobs");
    //process.exit(0);
});
