var onCopy = function(event) {
	chrome.extension.sendRequest({
		event: "copy",
	});
}

document.addEventListener("copy", onCopy, true);

