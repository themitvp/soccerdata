app.controller('networkController', function ($scope, $http, $location, $routeSegment, Page, socialnetworkService) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    $scope.selectednode = "test";

    Page.setTitle('Network Graph');

    $scope.init = function() {
        $scope.nodes = [];
        $scope.nodelinks = [];

        
        socialnetworkService.getGraph().then(function() {
            $scope.nodes = socialnetworkService.nodes;
            $scope.nodelinks = socialnetworkService.nodelinks;
        });
    };

    $scope.init();
});