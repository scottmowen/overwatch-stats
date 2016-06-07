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
		var category = $(this).val();
		updateTable(category);
	})


	function updateTable(category) {
		var legendCount = 1;
		var legend = {"Name": 0};

		function getLegend(str) {
			if (legend.hasOwnProperty(str)) return legend[str];
			else {
				var v = legend[str] = legendCount++;
				return v;
			}
		}

		function getLegendArray() {
			var arr = [];
			for (var prop in legend) {
				arr[legend[prop]] = prop;
			}
			return arr;
		}

		function identity(d) {
			return d
		}

		var data = [];
		var obj = {};
		for (var player in stats) {
			obj = stats[player][category];
			obj["Name"] = player;
			data.push(obj);
		}

		var dataTable = data.map(function (obj) {
			var arr = [];
			for (var prop in obj) {
				arr[getLegend(prop)] = obj[prop];
			}
			arr.length = legendCount;
			return arr;
		});

		var table = d3.select('table');

		var thead = table.select('thead');

		var tbody = table.select('tbody');

		var th = thead.selectAll("th")
			.data(getLegendArray());

		th.enter().append("th");
		th.exit().remove();
		th.text(identity);

		var tr = tbody.selectAll('tr')
			.data(dataTable);
		tr.enter().append('tr');
		tr.exit().remove();

		var td = tr.selectAll('td')
			.data(identity);
		td.enter().append('td');
		td.exit().remove();
		td.text(identity);
	}

	function getColumns(data) {
		var cols = [];
		for (var key in data) {
			cols.push(key);
		}
	}


})
