define(["ko-data/repo/repo"], function (Repo) {
	return Repo.extend({
		baseUrl: "/api",
		payloadParser: function (response) {
			if (response.error)
				throw new Error(response.error);

			return response;
		}		
	});
});