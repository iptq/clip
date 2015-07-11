var isValidURL = function(str) {
	var pattern = new RegExp('^(https?:\\/\\/)?'+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ '((\\d{1,3}\\.){3}\\d{1,3}))'+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ '(\\?[;&a-z\\d%_.~+=-]*)?'+ '(\\#[-a-z\\d_]*)?$','i');
	if(!pattern.test(str)) {
		return false;
	} else {
		return true;
	}
};

var Clippr = Clippr || {};

Clippr.GetCopiedText = function(callback) {
	var pasteTarget = document.createElement("input");
    // pasteTarget.contentEditable = true;
    var actElem = document.activeElement.appendChild(pasteTarget).parentNode;
    pasteTarget.focus();
    document.execCommand("paste");
    var paste = pasteTarget.value;
    actElem.removeChild(pasteTarget);
    callback(paste);
};

Clippr.PasteInto = function(url, long) {
	var copyFrom = $('<textarea/>');
	copyFrom.text(url);
	$('body').append(copyFrom);
	copyFrom.select();
	document.execCommand('copy');
	copyFrom.remove();

	chrome.storage.local.get({ urls: [] }, function(res) {
		var urls = res.urls;
		urls.push({
			shortUrl: url,
			longUrl: long
		});
		chrome.storage.local.set({ urls: urls }, function(res) {
			chrome.notifications.create("", {
				"type": "basic",
				"iconUrl": "../icons/1024.png",
				"title": "Success!",
				"message": "Link shortened to "+url+"!"
			}, function() {});
		});
	});
};

Clippr.Shorten = function(url) {
	chrome.storage.local.get("clippr_service", function(res) {
		var ClipprService = res.clippr_service;
		if (ClipprService.type) {
			if (ClipprService.type == "bitly" && ClipprService.bitly_code) {
				$.getJSON("https://api-ssl.bitly.com/v3/shorten", {
					"format": "json",
					"access_token": ClipprService.bitly_code,
					"longUrl": encodeURI(url)
				}, function(response) {
					console.log(response);
					Clippr.PasteInto(response.data.url, url);
				});
			} else {
				// u done fked up man
				Clippr.AskForService();
			}
		} else {
			Clippr.AskForService();
		}

	});
};

Clippr.Listener = function(request, sender, sendResponse) {
	if (request.event == "copy") {
		Clippr.GetCopiedText(function(text) {
			if (isValidURL(text)) {
				Clippr.Shorten(text);
			} else {
				// is not valid
			}
		});
	}
};

Clippr.AskForService = function() {
	chrome.tabs.create({ url: "options/index.html" });
};

chrome.extension.onRequest.addListener(Clippr.Listener);
chrome.runtime.onInstalled.addListener(Clippr.AskForService);

chrome.contextMenus.create({
	"title": "Copy and shorten link...",
	"contexts": [ "link" ],
	"onclick": function(e) {
		Clippr.Shorten(e.linkUrl);
	}
}, function() { });