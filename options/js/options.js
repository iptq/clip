var Clippr = Clippr || {};
Clippr.Options = Clippr.Options || {};

window.name = "clippr";
var oauth;

$(function () {
	$('[data-toggle="tooltip"]').tooltip();

	chrome.storage.local.get("clippr_service", function(res) {
		Clippr.Options = {};
		for(var key in res.clippr_service) {
			Clippr.Options[key] = res.clippr_service[key];
		}

		if (Clippr.Options.type) {
			if (Clippr.Options.type == "bitly" && Clippr.Options.bitly_code) {
				$("#service_bitly").prop("checked", true);
			}
		}
	});

	$(".radio input[type=radio]").change(function() {
		var selected = $(this).val();
		if (selected == "none") {
			chrome.storage.local.remove([ "clippr_service" ], function() {
				window.location.reload(true);
			});
		} else if (selected == "bitly") {
			oauth = window.open("https://bitly.com/oauth/authorize?client_id=fb182926c2be9225ac937b429cf7b854c967932f&redirect_uri=" + location.protocol + "//" + location.host + "/options/bitly_callback.html",
				"oauth",
				"menubar=no");
		}
	});
});