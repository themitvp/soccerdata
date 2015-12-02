var app = angular.module('soccerApp', ['ngRoute', 'route-segment', 'view-segment', 'ngAnimate', 'ui.bootstrap', 'ngResource', 'angular-loading-bar', 'ngTable']);

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

        .when('/', 'home')

        .when('/network', 'network')
        .when('/network/degree', 'network.degree')
        .when('/network/playerindex', 'network.playerindex')
        .when('/network/influential', 'network.influential')
        .when('/network/loyal', 'network.loyal')
        .when('/network/paradox', 'network.paradox')
        .when('/network/communities', 'network.communities')
        .when('/network/interactive', 'network.interactive')

        .when('/wiki', 'wiki')
        .when('/wiki/playerposition', 'wiki.playerposition')
        .when('/wiki/marketvalue', 'wiki.marketvalue')
        .when('/wiki/wordcloud', 'wiki.wordcloud')
        
        .when('/extrafun', 'extrafun')
        .when('/extrafun/transfers', 'extrafun.transfers')
        .when('/extrafun/italy', 'extrafun.italy')

        .otherwise('/')

        .segment('home', {
            default: true,
            templateUrl: '/static/templates/home/home.html?1',
            controller: 'homeController'
        })

        .segment('network', {
            templateUrl: '/static/templates/socialnetwork/network.html?1'
        })

        .within()

        .segment('networkhome', {
            default: true,
            templateUrl: '/static/templates/socialnetwork/socialnetwork.html?1',
            controller: 'socialnetworkController',
            resolve: resolve
        })

        .segment('degree', {
            templateUrl: '/static/templates/socialnetwork/degree.html?1',
            controller: 'degreeController',
            resolve: resolve
        })
        .segment('playerindex', {
            templateUrl: '/static/templates/socialnetwork/playerindex.html?1',
            controller: 'playerindexController',
            resolve: resolve
        })
        .segment('influential', {
            templateUrl: '/static/templates/socialnetwork/influential.html?1',
            controller: 'influentialController',
            resolve: resolve
        })
        .segment('loyal', {
            templateUrl: '/static/templates/socialnetwork/loyal.html?1',
            controller: 'loyalController',
            resolve: resolve
        })
        .segment('paradox', {
            templateUrl: '/static/templates/socialnetwork/paradox.html?1',
            controller: 'paradoxController',
            resolve: resolve
        })
        .segment('communities', {
            templateUrl: '/static/templates/socialnetwork/communities.html?1',
            controller: 'communitiesController',
            resolve: resolve
        })
        .segment('interactive', {
            templateUrl: '/static/templates/socialnetwork/interactive.html?1',
            controller: 'interactiveController',
            resolve: resolve
        })

        .up()

        .segment('wiki', {
            templateUrl: '/static/templates/wiki/wiki.html?1'
        })

        .within()

        .segment('wikipages', {
            default: true,
            templateUrl: '/static/templates/wiki/wikipages.html?1',
            controller: 'wikiController',
            resolve: resolve
        })

        .segment('playerposition', {
            templateUrl: '/static/templates/wiki/playerposition.html?1',
            controller: 'playerpositionController',
            resolve: resolve
        })

        .segment('marketvalue', {
            templateUrl: '/static/templates/wiki/marketvalue.html?1',
            controller: 'marketvalueController',
            resolve: resolve
        })

        .segment('wordcloud', {
            templateUrl: '/static/templates/wiki/wordcloud.html?1',
            controller: 'wordcloudController',
            resolve: resolve
        })

        .up()

        .segment('extrafun', {
            templateUrl: '/static/templates/extra/extra.html?1'
        })

        .within()

        .segment('extrafuntext', {
            default: true,
            templateUrl: '/static/templates/extra/fun.html?1',
            controller: 'extrafunController',
            resolve: resolve
        })
        .segment('transfers', {
            templateUrl: '/static/templates/extra/transfers.html?1',
            controller: 'transfersController',
            resolve: resolve
        })
        .segment('italy', {
            templateUrl: '/static/templates/extra/italy.html?1',
            controller: 'italyController',
            resolve: resolve
        })

        .up();
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

// Keep trailing slash when fetching from API
app.config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});