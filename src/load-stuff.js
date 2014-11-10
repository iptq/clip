chrome.storage.local.get({ urls: [], login: "kspksp", apiKey: "R_d7178ff7bd7919c88b4b16e833471b87" }, function(res) {
	var urls = res.urls;
	var ohtml = "";
	for(var i=urls.length-1; i>=0; i--) {
		ohtml += "<li><a href='" + urls[i].longUrl + "' target='_blank'>" + urls[i].longUrl + "</a> shortened to <a href='" + urls[i].shortUrl + "' target='_blank'>" + urls[i].shortUrl + "</a></li>";
	}
	$("#url-list").html(ohtml);

	$("#apiKey").val(res.apiKey);
	$("#login").val(res.login);
});

$("#update").click(function() {
	chrome.storage.local.set({ login: $("#login").val(), apiKey: $("#apiKey").val() }, function(res) {
		chrome.notifications.create("", {
			"type": "basic",
			"iconUrl": "icon-128.png",
			"title": "Updated!",
			"message": "API key and username has been updated!"
		}, function() {});
	});
});