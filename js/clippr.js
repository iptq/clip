var Clippr = Clippr || {};

Clippr.onCopy = function() {
	chrome.extension.sendRequest({
		event: "copy"
	});
};

document.addEventListener("DOMContentLoaded", function(event) { 
	document.addEventListener("copy", Clippr.onCopy, true);
	console.log("Clippr script has been loaded.");
});