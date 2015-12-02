app.controller('socialnetworkController', function ($scope, $http, $location, $routeSegment, Page, socialnetworkService) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    
    Page.setTitle('Social Network');

    $scope.init = function() {
        
    };

    $scope.init();
});