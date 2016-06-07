$(document).ready(function () {
	var scott = {},
		frank = {},
		jay = {},
		sauce = {},
		rizzo = {},
		dan = {},
		yosef = {},
		nick = {},
		andy = {},
		stats = {};

	var players = [];

	$.getJSON("http://scottmowen.com/overwatch-stats/data/stats.json", function (data) {
		scott = data["Scott"];
		frank = data["Frank"];
		jay = data["Jay"];
		sauce = data["Sauce"];
		rizzo = data["Rizzo"];
		dan = data["Dan"];
		yosef = data["Yosef"];
		nick = data["Nick"];
		andy = data["Andy"];
		stats = data;

		updateTable("Combat");
	});


	$("#categorySelect").change(function () {
		var category = $(this).text();
		updateTable(category);
	})

	function updateTable(category) {
		var data = [];
		var obj = {};
		for (var player in stats) {
			obj = stats[player][category];
			obj["Name"] = player;
			data.push(obj);
		}

		var table = d3.select('body').append('table');

		var thead = table.append('thead');

		var th = thead.selectAll("th")
			.data(d3.keys(data[0]))
			.enter().append("th")
			.text(function(d){return d});

		var tr = table.selectAll('tr')
			.data(data).enter()
			.append('tr');

		var td = tr.selectAll('td')
			.data(function (d) {
				return d3.values(d)
			})
			.enter().append('td')
			.text(function (d) {
				return d
			});
	}

	function getColumns(data) {
		var cols = [];
		for (var key in data) {
			cols.push(key);
		}
	}


})
