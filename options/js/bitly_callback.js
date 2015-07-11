var getQueryParams = function(qs) {
	var params, re, tokens;
	qs = qs.split('+').join(' ');
	params = {};
	tokens = void 0;
	re = /[?&]?([^=]+)=([^&]*)/g;
	while (tokens = re.exec(qs)) {
		params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	}
	return params;
};

var q = getQueryParams(location.search);
if (q.code) {
	console.log(q.code);
	$.ajax({
		url: "https://api-ssl.bitly.com/oauth/access_token",
		type: "POST",
		dataType: "text",
		contentType: "application/x-www-form-urlencoded",
		data: {
			client_id: "fb182926c2be9225ac937b429cf7b854c967932f",
			client_secret: "d8e7afad421d7665335142ef8ec7e1395d0813dd",
			code: q.code,
			redirect_uri: location.origin + location.pathname
		},
		success: function(result) {
			var data = getQueryParams("?" + result);
			console.log(data);
			chrome.storage.local.set({ clippr_service: { type: "bitly", bitly_code: data.access_token, login: data.login } }, function(res) {
				chrome.notifications.create("", {
					"type": "basic",
					"iconUrl": "../icons/1024.png",
					"title": "Done.",
					"message": "Successfully logged into Bitly!"
				}, function() {
				});
				window.close();
			});
		}
	});
} else {
	document.write("Not successful. Please try again.");
}