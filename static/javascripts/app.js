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
    var header = '';
    return {
        title: function () {
            return title;
        },
        setTitle: function (newTitle) {
            title = newTitle + " | Soccer Data";
            header = newTitle;
        },
        header: function () {
            return header;
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
            templateUrl: '/static/templates/home/home.html?5',
            controller: 'homeController'
        })

        .segment('network', {
            templateUrl: '/static/templates/socialnetwork/network.html?2'
        })

        .within()

        .segment('networkhome', {
            default: true,
            templateUrl: '/static/templates/socialnetwork/socialnetwork.html?2',
            controller: 'socialnetworkController',
            resolve: resolve
        })

        .segment('degree', {
            templateUrl: '/static/templates/socialnetwork/degree.html?2',
            controller: 'degreeController',
            resolve: resolve
        })
        .segment('playerindex', {
            templateUrl: '/static/templates/socialnetwork/playerindex.html?2',
            controller: 'playerindexController',
            resolve: resolve
        })
        .segment('influential', {
            templateUrl: '/static/templates/socialnetwork/influential.html?2',
            controller: 'influentialController',
            resolve: resolve
        })
        .segment('loyal', {
            templateUrl: '/static/templates/socialnetwork/loyal.html?2',
            controller: 'loyalController',
            resolve: resolve
        })
        .segment('paradox', {
            templateUrl: '/static/templates/socialnetwork/paradox.html?2',
            controller: 'paradoxController',
            resolve: resolve
        })
        .segment('communities', {
            templateUrl: '/static/templates/socialnetwork/communities.html?2',
            controller: 'communitiesController',
            resolve: resolve
        })
        .segment('interactive', {
            templateUrl: '/static/templates/socialnetwork/interactive.html?2',
            controller: 'interactiveController',
            resolve: resolve
        })

        .up()

        .segment('wiki', {
            templateUrl: '/static/templates/wiki/wiki.html?2'
        })

        .within()

        .segment('wikipages', {
            default: true,
            templateUrl: '/static/templates/wiki/wikipages.html?3',
            controller: 'wikiController',
            resolve: resolve
        })

        .segment('playerposition', {
            templateUrl: '/static/templates/wiki/playerposition.html?2',
            controller: 'playerpositionController',
            resolve: resolve
        })

        .segment('marketvalue', {
            templateUrl: '/static/templates/wiki/marketvalue.html?3',
            controller: 'marketvalueController',
            resolve: resolve
        })

        .segment('wordcloud', {
            templateUrl: '/static/templates/wiki/wordcloud.html?4',
            controller: 'wordcloudController',
            resolve: resolve
        })

        .up()

        .segment('extrafun', {
            templateUrl: '/static/templates/extra/extra.html?2'
        })

        .within()

        .segment('extrafuntext', {
            default: true,
            templateUrl: '/static/templates/extra/fun.html?2',
            controller: 'extrafunController',
            resolve: resolve
        })
        .segment('transfers', {
            templateUrl: '/static/templates/extra/transfers.html?3',
            controller: 'transfersController',
            resolve: resolve
        })
        .segment('italy', {
            templateUrl: '/static/templates/extra/italy.html?2',
            controller: 'italyController',
            resolve: resolve
        })

        .up();
});

// Keep trailing slash when fetching from API
app.config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
});