function isValidURL(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ '((\\d{1,3}\\.){3}\\d{1,3}))'+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ '(\\?[;&a-z\\d%_.~+=-]*)?'+ '(\\#[-a-z\\d_]*)?$','i');
	if(!pattern.test(str)) {
		return false;
	} else {
		return true;
	}
}

function getCopiedText(callback) {
	var pasteTarget = document.createElement("input");
    // pasteTarget.contentEditable = true;
    var actElem = document.activeElement.appendChild(pasteTarget).parentNode;
    pasteTarget.focus();
    document.execCommand("paste");
    var paste = pasteTarget.value;
    actElem.removeChild(pasteTarget);
    callback(paste);
}

function shorten(text) {
	alert("shortening...");
	$.getJSON("https://api-ssl.bitly.com/v3/shorten", {
		"format": "json",
		"login": "kspksp",
		"apiKey": "R_d7178ff7bd7919c88b4b16e833471b87",
		"longUrl": text,
	}, function(response) {
		// alert("shortened to "+response.data.url);
		pasteInto(response.data.url);
	});
	/*
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api-ssl.bitly.com/v3/.....");
	xhr.onreadystatechange = function() { 
	    if(xhr.readyState == 4) { 
	        if(xhr.status==200) {
	            console.log("CORS works!", xhr.responseText);         
	        } else {
	            console.log("Oops", xhr);
	        }
	    } 
	}
	xhr.send();
	*/
}

function pasteInto(url) {
	var copyFrom = $('<textarea/>');
	copyFrom.text(url);
	$('body').append(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	copyFrom.remove();

	alert("done!");
}

function copyListener(request, sender, sendResponse) {
	if (request.event == "copy") {
		getCopiedText(function(text) {
			if (isValidURL(text)) {
				shorten(text);
			} else {
				// alert("isn't valid!");
			}
		});
	}
}

chrome.extension.onRequest.addListener(copyListener);