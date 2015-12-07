app.controller('loyalController', function ($scope, $http, $location, $routeSegment, Page) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    
    Page.setTitle('Old Players Are More Loyal');
});