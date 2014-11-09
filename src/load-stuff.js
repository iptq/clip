chrome.storage.local.get({ urls: [] }, function(res) {
	var urls = res.urls;
	var ohtml = "";
	for(var i=urls.length-1; i>=0; i--) {
		ohtml += "<li><a href='" + urls[i].longUrl + "' target='_blank'>" + urls[i].longUrl + "</a> shortened to <a href='" + urls[i].shortUrl + "' target='_blank'>" + urls[i].shortUrl + "</a></li>";
	}
	$("#url-list").html(ohtml);
});
