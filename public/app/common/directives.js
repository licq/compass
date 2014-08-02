(function () {
  angular.module('compass')
    .directive('customBackground', function () {
      return {
        restrict: 'A',
        controller: [
          '$scope', '$element', '$location', function ($scope, $element, $location) {
            var addBg, path;
            path = function () {
              return $location.path();
            };
            addBg = function (path) {
              $element.removeClass('body-home body-special');
              switch (path) {
                case '/':
                  return $element.addClass('body-home');
                case '/404':
                case '/500':
                case '/login':
                case '/signup':
                case '/signup/activate':
                case '/signup/success':
                case '/welcome':
                case '/forgot':
                case '/forgot/reset':
                  return $element.addClass('body-special');
              }
            };
            addBg($location.path());
            return $scope.$watch(path, function (newVal, oldVal) {
              if (newVal === oldVal) {
                return;
              }
              return addBg($location.path());
            });
          }
        ]
      };
    })
    .directive('uiColorSwitch', [
      function () {
        return {
          restrict: 'A',
          link: function (scope, ele) {
            return ele.find('.color-option').on('click', function (event) {
              var $this, hrefUrl, style;
              $this = $(this);
              hrefUrl = void 0;
              style = $this.data('style');
              if (style === 'loulou') {
                hrefUrl = 'styles/main.css';
                $('link[href^="styles/main"]').attr('href', hrefUrl);
              } else if (style) {
                style = '-' + style;
                hrefUrl = 'styles/main' + style + '.css';
                $('link[href^="styles/main"]').attr('href', hrefUrl);
              } else {
                return false;
              }
              return event.preventDefault();
            });
          }
        };
      }
    ]).directive('toggleMinNav', [
      '$rootScope', function ($rootScope) {
        return {
          restrict: 'A',
          link: function (scope, ele) {
            var $content, $nav, $window, Timer, app, updateClass;
            app = $('#app');
            $window = $(window);
            $nav = $('#nav-container');
            $content = $('#content');
            ele.on('click', function (e) {
              if (app.hasClass('nav-min')) {
                app.removeClass('nav-min');
              } else {
                app.addClass('nav-min');
                $rootScope.$broadcast('minNav:enabled');
              }
              return e.preventDefault();
            });
            Timer = void 0;
            updateClass = function () {
              var width;
              width = $window.width();
              if (width < 768) {
                return app.removeClass('nav-min');
              }
            };
            return $window.resize(function () {
              var t;
              clearTimeout(t);
              return setTimeout(updateClass, 300);
            });
          }
        };
      }
    ]).directive('collapseNav', [
      function () {
        return {
          restrict: 'A',
          link: function (scope, ele) {
            var $a, $aRest, $lists, $listsRest, app;
            $lists = ele.find('ul').parent('li');
            $lists.append('<i class="fa fa-caret-right icon-has-ul"></i>');
            $a = $lists.children('a');
            $listsRest = ele.children('li').not($lists);
            $aRest = $listsRest.children('a');
            app = $('#app');
            $a.on('click', function (event) {
              var $parent, $this;
              if (app.hasClass('nav-min')) {
                return false;
              }
              $this = $(this);
              $parent = $this.parent('li');

              $lists.not($parent).removeClass('open').find('ul').slideUp();

              $parent.toggleClass('open').find('ul').slideToggle();
              setTimeout(function () {
                $('#nav').trigger('mouseover');
              }, 300);
              return event.preventDefault();
            });
            $aRest.on('click', function () {
              return $lists.removeClass('open').find('ul').slideUp();
            });
            return scope.$on('minNav:enabled', function () {
              return $lists.removeClass('open').find('ul').slideUp();
            });
          }
        };
      }
    ]).directive('highlightActive', [
      function () {
        return {
          restrict: 'A',
          controller: [
            '$scope', '$element', '$attrs', '$location', function ($scope, $element, $attrs, $location) {
              var highlightActive, links, path;
              links = $element.find('a');
              path = function () {
                return $location.path();
              };
              highlightActive = function (links, path) {
                path = '#' + path;
                return angular.forEach(links, function (link) {
                  var $li, $link, href;
                  $link = angular.element(link);
                  $li = $link.parent('li');
                  href = $link.attr('href');
                  if ($li.hasClass('active')) {
                    $li.removeClass('active');
                  }
                  if (path.indexOf(href) === 0) {
                    return $li.addClass('active');
                  }
                });
              };
              highlightActive(links, $location.path());
              return $scope.$watch(path, function (newVal, oldVal) {
                if (newVal === oldVal) {
                  return;
                }
                return highlightActive(links, $location.path());
              });
            }
          ]
        };
      }
    ]).directive('toggleOffCanvas', [
      function () {
        return {
          restrict: 'A',
          link: function (scope, ele) {
            return ele.on('click', function () {
              return $('#app').toggleClass('on-canvas');
            });
          }
        };
      }
    ]).directive('slimScroll', [
      function () {
        return {
          restrict: 'A',
          link: function (scope, ele, attrs) {
            return ele.slimScroll({
              height: attrs.scrollHeight || '100%',
              color: '#31c0be',
              opacity: 0.7
            });
          }
        };
      }
    ]).directive('goBack', [
      function () {
        return {
          restrict: 'A',
          controller: [
            '$scope', '$element', '$window', function ($scope, $element, $window) {
              return $element.on('click', function () {
                return $window.history.back();
              });
            }
          ]
        };
      }
    ]).directive('hasPermission', ['mvPermission',
      function (mvPermission) {
        return {
          link: function (scope, element, attrs) {
            if (!_.isString(attrs.hasPermission))
              throw 'hasPermission value must be a string';

            var value = attrs.hasPermission.trim();
            var notPermissionFlag = value[0] === '!';
            if (notPermissionFlag) {
              value = value.slice(1).trim();
            }

            function toggleVisibilityBasedOnPermission() {
              var hasPermission = mvPermission.hasPermission(value);

              if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag)
                element.show();
              else
                element.hide();
            }

            toggleVisibilityBasedOnPermission();
            scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
          }
        };
      }
    ]).directive('scrollTo', ['$timeout', function ($timeout) {

      function scroll(settings) {
        return function () {
          var scrollPane = angular.element(settings.container);
          var scrollTo = (typeof settings.scrollTo === 'number') ? settings.scrollTo : angular.element(settings.scrollTo);
          var scrollY = (typeof scrollTo === 'number') ? scrollTo : scrollTo.offset().top - settings.offset;
          scrollPane.animate({scrollTop: scrollY }, settings.duration, settings.easing, function () {
          });
        };
      }

      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var settings = angular.extend({
            container: 'section',
            scrollTo: angular.element(),
            offset: 0,
            duration: 150,
            easing: 'swing'
          }, attrs);
          element.on('click', function () {
            $timeout(scroll(settings));
          });
        }
      };
    }]).directive('scrollToSectionTop', function () {
      return {
        restrict: 'A',
        link: function (scope, $elm) {
          $elm.on('click', function () {
            $('section').animate({scrollTop: $('section').offset().top}, 5);
          });
        }
      };
    }).directive('onFinishRender', function () {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          if (scope.$last === true) {
            scope.$evalAsync(attr.onFinishRender);
          }
        }
      };
    });
}).call(this);
