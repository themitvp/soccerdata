var app = angular.module('soccerApp', ['ngRoute', 'route-segment', 'view-segment', 'ngAnimate', 'ui.bootstrap', 'angular-loading-bar']);

var resolve = {
    delay: function ($q, $timeout) {
        var delay = $q.defer();
        $timeout(delay.resolve, 0, false);
        return delay.promise;
    }
};

app.factory('Page', function () {
    var title = 'Soccer Data';
    return {
        title: function () {
            return title;
        },
        setTitle: function (newTitle) {
            title = newTitle + " | Soccer Data";
        }
    };
});

// configure our routes
app.config(function ($routeSegmentProvider, $locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeSegmentProvider.options.autoLoadTemplates = true;

    $routeSegmentProvider.otherwise = function (route) {
        $routeProvider.otherwise({redirectTo: route});
        return this;
    };


    $routeSegmentProvider

        .when('/', 'dashboard')
        //.when('/import', 'import')
        //.when('/overview/:dataSetId', 'overview')
        .otherwise('/')

        .segment('dashboard', {
            default: true,
            templateUrl: '/static/templates/dashboard.html?1',
            controller: 'dashboardController'
        });
});

app.run(function ($rootScope, $window) {
    // publish current transition direction on rootScope
    $rootScope.direction = 'left';
    // listen change start events
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        $rootScope.direction = 'right';
        // console.log(arguments);
        if (current && next && (current.depth > next.depth)) {
            $rootScope.direction = 'left';
        }
        // back
        $rootScope.back = function () {
            $window.history.back();
        };
    });
});