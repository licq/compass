'use strict';

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);
    // Project Configuration

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            options: {
                port: process.env.PORT || 3000
            },
            dev: {
                options: {
                    script: 'server.js',
                    debug: true
                }
            },
            prod: {
                options: {
                    script: 'server.js',
                    node_env: 'production'
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= express.options.port%>'
            }
        },
        watch: {
            js: {
                files: ['public/app/**/*.js', 'public/js/**'],
                tasks: ['newer:jshint:app', 'karma'],
                options: {
                    livereload: true,
                }
            },
            mochaTest: {
                files: ['test/server/**/*.js'],
                tasks: ['newer:jshint:test_server', 'mochaTest']
            },
            clientTest: {
                files: ['test/client/**/*.js'],
                tasks: ['newer:jshint:test_client', 'karma']
            },
            styles: {
                files: ['public/**/*.css'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },

            express: {
                files: [
                    'server.js',
                    'server/**/*.{js,json}'
                ],
                tasks: ['newer:jshint:server', 'env:test', 'mochaTest', 'express:dev', 'wait'],
                options: {
                    livereload: true,
                    nospawn: true
                }
            },

            html: {
                files: ['public/app/**/*.html', 'server/views/**'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
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
                        PORT: process.env.PORT || 3000
                    },
                    cwd: __dirname,
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    }
                }
            }
        },
        concurrent: {
            server: {

            },
            test: {

            },
            debug: {
                tasks: ['nodemon', 'node-inspector'],
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
                singleRun: true
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

    grunt.registerTask('wait', function () {
        grunt.log.ok('Waiting for server reload...');

        var done = this.async();

        setTimeout(function () {
            grunt.log.writeln('Done waiting!');
            done();
        }, 500);
    });

    grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
        this.async();
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['express:prod', 'open', 'express-keepalive']);
        }

        if (target === 'debug') {
            return grunt.task.run(['concurrent:server', 'concurrent:debug']);
        }

        grunt.task.run([
            'concurrent:server',
            'express:dev',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', function (target) {
        if (target === 'client') {
            return grunt.task.run([ 'concurrent:test', 'karma']);
        }
        if (target === 'server') {
            return grunt.task.run(['env:test', 'mochaTest']);
        }
        grunt.task.run(['env:test', 'mochaTest', 'concurrent:test', 'karma']);
    });

    grunt.registerTask('default', ['newer:jshint', 'test']);
};
