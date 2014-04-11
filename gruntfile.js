'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            client: {
                files: ['public/app/**'],
                tasks: ['jshint:client', 'test:client'],
                options: {
                    livereload: true
                }
            },
            server: {
                files: ['server.js', 'server/**'],
                tasks: ['jshint:server']
            },
            gruntfile: {
                files: ['gruntfile.js'],
                tasks: ['jshint:gruntfile']
            },
            testClient: {
                files: ['test/client/**'],
                tasks: ['jshint:testClient', 'test:client'],
            },
            testServer: {
                files: ['test/server/**'],
                tasks: ['jshint:testServer'],
            },

            styles: {
                files: ['public/**/*.css'],
                options: {
                    livereload: true
                }
            },

            rebooted: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
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
            client: {
                src: ['public/app/**/*.js']
            },
            testServer: {
                src: ['test/server/**/*.js']
            },
            testClient: {
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
                }
            },

            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    ignore: ['public/**', 'test/**'],
                    callback: function (nodemon) {
                        nodemon.on('restart', function () {
                            setTimeout(function () {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
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
                require: 'server.js',
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
            'testServer': {
                files: {
                    'test': ['server/**/*']
                }
            },
            client: {
                files: {
                    'public': ['app/**/*']
                }
            },
            'testClient': {
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
        grunt.task.run([ 'concurrent:dev' ]);
    });

    grunt.registerTask('test', function (target) {
        if (target === 'client') {
            return grunt.task.run(['karma']);
        }
        if (target === 'server') {
            return grunt.task.run(['env:test', 'mochaTest']);
        }
        grunt.task.run(['test:server', 'test:client']);
    });

    grunt.registerTask('default', ['jshint', 'test', 'sloc']);
};
