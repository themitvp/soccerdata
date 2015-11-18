app.controller('mainController', function ( $scope, $http, $location, $routeSegment, Page ) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
});