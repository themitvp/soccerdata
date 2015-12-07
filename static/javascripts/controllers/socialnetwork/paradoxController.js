app.controller('paradoxController', function ($scope, $http, $location, $routeSegment, Page) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    
    Page.setTitle('Friendship Paradox');
});