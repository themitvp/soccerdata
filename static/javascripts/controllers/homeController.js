app.controller('homeController', function ($scope, $http, $location, $routeSegment, Page) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    
    Page.setTitle('Home');
});