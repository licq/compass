var jobs = require('./server/tasks/jobs');
var config = require('./server/config/config');
jobs.init(config);
require('./server/config/mongoose')(config);
jobs.recreateFetchEmailJobs(function(){
    console.log("recreate email fetch jobs");
    process.exit(0);
});
