app.controller('playerpositionController', function ($scope, $http, $location, $routeSegment, Page) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    
    Page.setTitle('Player Position Classifier');
});