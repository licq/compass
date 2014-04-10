'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            code: {
                files: ['public/app/**/*.js', 'public/js/**','public/**/*.css','gruntfile.js','server.js','server/**/*.{js,json}','public/app/**/*.html', 'server/views/**'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                }
            },
            test: {
                files: ['test/server/**/*.js','test/client/**/*.js'],
                tasks: ['jshint']
            }
        },
        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 5, // maximum number of notifications from jshint output
                title: 'Compass' // defaults to the name in package.json, or will use project directory's name
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: ['gruntfile.js']
            },
            server: {
                options: {
                    jshintrc: 'server/.jshintrc'
                },
                src: ['server/**/*.js', 'server.js']
            },
            app: {
                src: ['public/app/**/*.js']
            },
            test_server: {
                src: ['test/server/**/*.js']
            },
            test_client: {
                src: ['test/client/**/*.js']
            }
        },

        'node-inspector': {
            custom: {
                options: {
                    'web-host': 'localhost'
                }
            }
        },

        nodemon: {
            debug: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug-brk'],
                    env: {
                        PORT: require('./server/config/config').port
                    },
                    cwd: __dirname,
                }
            },

            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['public/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: require('./server/config/config').port
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            debug: {
                tasks: ['nodemon:debug', 'node-inspector'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server.js'
            },
            src: ['test/server/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        karma: {
            unit: {
                configFile: 'test/client/karma.conf.js',
            }
        },
        sloc: {
            server: {
                files: {
                    'server': ['**/*']
                }
            },
            'test_server': {
                files: {
                    'test': ['server/**/*']
                }
            },
            client: {
                files: {
                    'public': ['app/**/*']
                }
            },
            'test_client': {
                files: {
                    'test': ['client/**/*']
                }
            }
        }
    });

    grunt.task.run('notify_hooks');

    grunt.option('force', true);

    grunt.registerTask('serve', function (target) {
        if (target === 'debug') {
            return grunt.task.run(['concurrent:debug']);
        }
        grunt.task.run([
            'concurrent:dev'
        ]);
    });

    grunt.registerTask('test', function (target) {
        if (target === 'client') {
            return grunt.task.run(['karma']);
        }
        if (target === 'server') {
            return grunt.task.run(['env:test', 'mochaTest']);
        }
        grunt.task.run(['env:test', 'mochaTest', 'karma']);
    });

    grunt.registerTask('default', ['jshint', 'test']);
};
