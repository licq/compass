'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    project: {
      app: 'public',
      dist: 'dist'
    },
    watch: {
      client: {
        files: ['public/app/**/*.js'],
        tasks: ['jshint:client', 'test:client']
      },
      server: {
        files: ['server.js', 'server/**/*.js'],
        tasks: ['jshint:server']
      },
      gruntfile: {
        files: ['gruntfile.js'],
        tasks: ['jshint:gruntfile']
      },
      testClient: {
        files: ['test/client/**/*.js'],
        tasks: ['jshint:testClient', 'test:client'],
      },
      testServer: {
        files: ['test/server/**/*.js'],
        tasks: ['jshint:testServer'],
      },

      livereload: {
        files: ['.rebooted', 'server/**/*.html', 'public/app/**', 'public/css/*.css'],
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
        src: ['public/app/**/*.js'],
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
          ignore: ['public/**', 'test/**', 'compass.log', 'compass-test.log'],
          callback: function (nodemon) {
            nodemon.on('restart', function () {
              setTimeout(function () {
                require('fs').writeFileSync('.rebooted', 'rebooted');
              }, 3000);
            });
          }
        }
      },
      prod: {
        script: 'dist/server.js',
        options: {
          env: {
            NODE_ENV: 'production',
          }
        }
      }
    },
    express: {
      prod: {
        options: {
          script: '<%=project.dist%>/server.js',
          node_env: 'production'
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
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= project.dist %>/*',
              '!<%= project.dist %>/.git*',
              '!<%= project.dist %>/Procfile'
            ]
          }
        ]
      },
      server: '.tmp'
    },
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/styles/',
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
          }
        ]
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= project.dist %>/public/scripts/{,*/}*.js',
            '<%= project.dist %>/public/styles/{,*/}*.css',
            '<%= project.dist %>/public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= project.dist %>/public/styles/fonts/*'
          ]
        }
      }
    },
    useminPrepare: {
      html: [
        'server/views/index.html',
      ],
      options: {
        dest: '<%= project.dist %>/public'
      }
    },
    usemin: {
      html: [ '<%= project.dist %>/server/views/{,*/}*.html' ],
//      css: ['<%= project.dist %>/public/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= project.dist %>/public']
      }
    },

    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: '*.js',
            dest: '.tmp/concat/scripts'
          }
        ]
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= project.app %>',
            dest: '<%= project.dist %>/public',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'img/{,*/}*.{webp}',
              'fonts/**/*'
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: '<%= project.app %>/vendor/select2',
            dest: '<%= project.dist %>/public/styles',
            src: [
              '**/*.{png,gif}'
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: '<%= project.app %>/app',
            dest: '<%= project.dist %>/public/app',
            src: '**/*.html'
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= project.dist %>/public/images',
            src: ['generated/*']
          },
          {
            expand: true,
            dest: '<%= project.dist %>',
            src: [
              'package.json',
              'server.js',
              'server/**/*'
            ]
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= project.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
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
        configFile: 'test/client/karma.conf.js'
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
    } else if (target === 'prod') {
      return grunt.task.run(['build', 'nodemon:prod'])
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

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concat',
    'autoprefixer',
    'ngmin',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['jshint', 'test', 'sloc']);
  grunt.registerTask('all', ['jshint', 'test', 'sloc', 'build']);
};
