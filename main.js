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

		updateDisplay("Combat");
	});


	$("#categorySelect").change(function () {
		var category = $(this).val();
		updateDisplay(category);
	})

	function identity(d) {
		return d
	}

	function convertData(data) {
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

		var tableData = data.map(function (obj) {
			var arr = [];
			for (var prop in obj) {
				arr[getLegend(prop)] = obj[prop];
			}
			return arr;
		});

		tableData.forEach(function (row) {
			row.length = legendCount;
		})

		return {
			"legend": getLegendArray(),
			"tableData": tableData
		}
	}

	function updateDisplay(category) {
		var data = [];
		var obj = {};
		for (var player in stats) {
			obj = stats[player][category];
			obj["Name"] = player;
			data.push(obj);
		}

		var convertedData = convertData(data);

		updateTable(convertedData);

		$("#chartSelect").change(function () {
			var category = $(this).val();
			createBarChart(category, convertedData);
		});

		var chartSelect = d3.select('#chartSelect');

		var option = chartSelect.selectAll('option')
			.data(convertedData.legend);
		option.enter().append('option')
			.attr('value', identity)
			.attr('class', 'chart-option');
		option.exit().remove();
		option.text(identity);
	}

	function updateTable(data) {

		var table = d3.select('table');

		var thead = table.select('thead');

		var tbody = table.select('tbody');

		var th = thead.selectAll("th")
			.data(data.legend);

		th.enter().append("th");
		th.exit().remove();
		th.text(identity);

		var tr = tbody.selectAll('tr')
			.data(data.tableData);
		tr.enter().append('tr');
		tr.exit().remove();

		var td = tr.selectAll('td')
			.data(identity);
		td.enter().append('td');
		td.exit().remove();
		td.text(identity);
	}

	function createBarChart(category, data) {

		var chartData = data.tableData.map(function (item) {
			return {
				"name": item[data.legend.indexOf("Name")],
				"value": parseInt((item[data.legend.indexOf(category)] || "0").replace(/,/g, ""), 10)
			}
		});

		var width = 800,
			barHeight = 40;

		var x = d3.scale.linear()
			.domain([0, d3.max(chartData, function (d) {
				return d.value;
			})])
			.range([0, width-50]);

		var chart = d3.select(".chart")
			.attr("width", width)
			.attr("height", barHeight * chartData.length);

		var bar = chart.selectAll("g")
			.data(chartData);

		/*bar.enter().append("g")
		 .attr("transform", function (d, i) {
		 return "translate(0," + i * barHeight + ")";
		 });*/

		bar.exit().remove();
		var newBar = bar.enter().append("g");


		newBar.append("rect");
		newBar.append("text")
			.attr('class', 'name-text');
		newBar.append("text")
			.attr('class', 'value-text');

		bar.attr("transform", function (d, i) {
			return "translate(0," + i * barHeight + ")";
		});

		bar.select("rect")
			.attr("width", function (d) {
				return x(d.value);
			})
			.attr("class", function (d) {
				return d.name;
			})
			.attr("height", barHeight - 1);

		bar.select(".name-text")
			.attr("x", function (d) {
				return x(d.value) - 50;
			})
			.attr("y", barHeight / 2)
			.attr("dy", ".35em")
			.text(function (d) {
				return d.value;
			});

		bar.select(".value-text")
			.attr("x", -50)
			.attr("y", barHeight / 2)
			.attr("dy", ".35em")
			.text(function (d) {
				return d.name;
			});
	}

	function getColumns(data) {
		var cols = [];
		for (var key in data) {
			cols.push(key);
		}
	}


})
