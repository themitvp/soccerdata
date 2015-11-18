app.controller('socialnetworkController', function ($scope, $http, $location, $routeSegment, Page, socialnetworkService) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    

    Page.setTitle('Social Network');

    $scope.init = function() {
        $scope.testdata = "";
    };

    $scope.getTest = function() {
        return socialnetworkService.getTest().then(function(data) {
            $scope.testdata = data;
        });
    };

    $scope.init();
});