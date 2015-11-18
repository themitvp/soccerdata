app.service('dashboardService', ['$resource',
	function ($resource) {

		this.getTest = function() {
            return $resource('api/v1/dashboard').get().$promise;
        };
	}
]);