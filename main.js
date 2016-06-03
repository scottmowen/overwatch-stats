$(document).ready(function () {
	var scott, frank, jay, sauce, rizzo;

	var urls = {
		"Frank": "http://scottmowen.com/overwatch/data/frank.json",
		"Sauce": "http://scottmowen.com/overwatch/data/sauce.json",
		"Rizzo": "http://scottmowen.com/overwatch/data/rizzo.json",
		"Scott": "http://scottmowen.com/overwatch/data/scottworth.json",
		"Jay": "http://scottmowen.com/overwatch/data/jay.json"
	};

	var players = [];

	updateTable("combat");

	$("#categorySelect").change(function() {
		var category = $(this).text();
		updateTable(category);
	})

	$.getJSON("http://scottmowen.com/overwatch/data/stats.json")


	$.getJSON(urls.Scott, function (data) {
		scott = data;
		players.push(scott);
	});

	$.getJSON(urls.Frank, function (data) {
		frank = data;
		players.push(frank);
	});

	$.getJSON(urls.Jay, function (data) {
		jay = data;
		players.push(jay);
	});

	$.getJSON(urls.Sauce, function (data) {
		sauce = data;
		players.push(sauce);
	});

	$.getJSON(urls.Rizzo, function (data) {
		rizzo = data;
		players.push(rizzo);
	});

	function updateTable(category) {

	}



})
