var onCopy = function(event) {
	// alert("event!");
	chrome.extension.sendRequest({
		event: "copy",
	});
}

document.addEventListener("copy", onCopy, true);

// alert("hei");