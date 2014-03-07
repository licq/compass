var swig = require('swig');

if (process.env.NODE_ENV == 'development') {
    swig.setDefaults({ cache: false });
}

module.exports = swig;