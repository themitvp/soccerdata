app.service('socialnetworkService', ['$resource',
	function ($resource) {

		this.getTest = function() {
            return $resource('api/v1/socialnetwork/').get().$promise;
        };
	}
]);