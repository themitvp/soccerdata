app.controller('classifierController', function ($scope, $http, $location, $routeSegment, Page, classifierService) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    

    Page.setTitle('Classifier');

    $scope.init = function() {
        $scope.testdata = "";
    };

    $scope.getTest = function() {
        return classifierService.getTest().then(function(data) {
            $scope.testdata = data;
        });
    };

    $scope.init();
});