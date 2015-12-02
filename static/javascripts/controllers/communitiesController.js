app.controller('communitiesController', function ($scope, $http, $location, $routeSegment, Page, socialnetworkService, NgTableParams) {
    $scope.Page = Page;
    $scope.$routeSegment = $routeSegment;
    

    Page.setTitle('Communities');

    $scope.communities = [];

    $scope.init = function() {
        socialnetworkService.getCommunities().then(function(data) {
            $scope.communities = data;
        });

        $scope.tableCols = [
        { field: "region", title: "Region", show: true },
        { field: "nation", title: "Nation", show: true },
        { field: "c1", title: "C1", show: true },
        { field: "c2", title: "C2", show: true },
        { field: "c3", title: "C3", show: true },
        { field: "c4", title: "C4", show: true },
        { field: "c5", title: "C5", show: true },
        { field: "c6", title: "C6", show: true },
        { field: "c7", title: "C7", show: true },
        { field: "c8", title: "C8", show: true },
        { field: "c9", title: "C9", show: true },
        { field: "c10", title: "C10", show: true },
        { field: "c11", title: "C11", show: true },
        { field: "c12", title: "C12", show: true },
        { field: "c13", title: "C13", show: true },
        { field: "c14", title: "C14", show: true },
        { field: "c15", title: "C15", show: true },
        { field: "c16", title: "C16", show: true },
        { field: "c17", title: "C17", show: true },
        { field: "c18", title: "C18", show: true },
        { field: "c19", title: "C19", show: true },
        { field: "c20", title: "C20", show: true },
        { field: "c21", title: "C21", show: true },
        { field: "c22", title: "C22", show: true },
        { field: "total", title: "Total", show: true },
        ];

        $scope.tableParams = new NgTableParams(
        {
            sorting: { region: "desc" }
        },
        {
            getData: function() {
                return socialnetworkService.getCommunities().then(function(data) {
                    console.log(data.inlineCount);
                    return data;
                });
            }
        });
    };

    $scope.getColor = function(number) {
        var num = parseInt(number) || 0;

        if (num > 0) {
            return "bg-success";
        }
    };

    $scope.init();
});