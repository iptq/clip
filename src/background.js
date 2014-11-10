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

function shorten(url) {
	// alert("shortening...");
	chrome.storage.local.get({ apiKey: "R_d7178ff7bd7919c88b4b16e833471b87", login: "kspksp" }, function(res) {
		$.getJSON("https://api-ssl.bitly.com/v3/shorten", {
			"format": "json",
			"login": res.login,
			"apiKey": res.apiKey,
			"longUrl": url,
		}, function(response) {
			// alert("shortened to "+response.data.url);
			pasteInto(response.data.url, url);
		});
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

function pasteInto(url, long) {
	var copyFrom = $('<textarea/>');
	copyFrom.text(url);
	$('body').append(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	copyFrom.remove();

	// alert("done!");

	chrome.storage.local.get({ urls: [] }, function(res) {
		var urls = res.urls;
		urls.push({
			shortUrl: url,
			longUrl: long
		});
		chrome.storage.local.set({ urls: urls }, function(res) {
			chrome.notifications.create("", {
				"type": "basic",
				"iconUrl": "icon-128.png",
				"title": "Success!",
				"message": "Link shortened to "+url+"!"
			}, function() {});
		});
	});
}

function copyListener(request, sender, sendResponse) {
	if (request.event == "copy") {
		// alert("shit");
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

function clickHandler(e) {
	shorten(e.linkUrl);
}

chrome.contextMenus.create({
	"title": "Copy and shorten link...",
	"contexts": [ "link" ],
	"onclick": clickHandler
}, function() {
});