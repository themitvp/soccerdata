app.service('socialnetworkService', ['$resource',
	function ($resource) {
		this.nodes = [];
		this.nodelinks = [];

		this.getGraph = function() {
			return $resource('api/v1/socialnetwork/').get().$promise.then(function(data) {
				this.nodes = data.nodes;
				this.nodelinks = data['links'];
			}.bind(this));
		};
	}
	]);