$(document).ready(function () {
	var scott = {},
		frank = {},
		jay = {},
		sauce = {},
		rizzo = {},
		dan = {},
		yosef = {},
		nick = {},
		andy = {};

	var players = [];

	updateTable("combat");

	$("#categorySelect").change(function() {
		var category = $(this).text();
		updateTable(category);
	})

	$.getJSON("http://scottmowen.com/overwatch-stats/data/stats.json", function(data){
		scott = data["Scott"];
		frank = data["Frank"];
		jay = data["Jay"];
		sauce = data["Sauce"];
		rizzo = data["Rizzo"];
		dan = data["Dan"];
		yosef = data["Yosef"];
		nick = data["Nick"];
		andy = data["Andy"];
	});

	function updateTable(category) {

	}



})
