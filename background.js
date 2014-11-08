function isValidURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ '((\\d{1,3}\\.){3}\\d{1,3}))'+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ '(\\?[;&a-z\\d%_.~+=-]*)?'+ '(\\#[-a-z\\d_]*)?$','i');
	if(!pattern.test(str)) {
		return false;
	} else {
		return true;
	}
}

function getCopiedText(callback) {
	var pasteTarget = document.createElement("div");
    pasteTarget.contentEditable = true;
    alert(pasteTarget);
    var actElem = document.activeElement.appendChild(pasteTarget).parentNode;
    pasteTarget.focus();
    document.execCommand("paste", null, null);
    var paste = pasteTarget.innerText;
    actElem.removeChild(pasteTarget);
    callback(paste);
}

function copyListener(request, sender, sendResponse) {
	if (request.event == "copy") {
		getCopiedText(function(text) {
			alert("copied this shit: \"" + text + "\"");

			var valid = isValidURL(text);
			alert("is" + (valid ? "" : " not") + " a valid URL");

			// make request to bitly api

			// put shortened link into clipboard
		});
	}
	sendResponse({

	});
}

chrome.extension.onRequest.addListener(copyListener);