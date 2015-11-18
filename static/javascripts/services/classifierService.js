app.service('classifierService', ['$resource',
	function ($resource) {

		this.getTest = function() {
            return $resource('api/v1/classifier/').get().$promise;
        };
	}
]);