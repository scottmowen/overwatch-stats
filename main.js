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


		var tableData = data.map(function (obj) {
			var arr = [];
			for (var prop in obj) {
				arr[getLegend(prop)] = obj[prop];
			}
			return arr;
		});

		var headers = getLegendArray();
		headers.shift(); //remove "Name" from options

		tableData.forEach(function (row) {
			row.length = legendCount;
		})

		var table = d3.select('table');

		var thead = table.select('thead');

		var tbody = table.select('tbody');

		var th = thead.selectAll("th")
			.data(getLegendArray());

		th.enter().append("th");
		th.exit().remove();
		th.text(identity);

		var tr = tbody.selectAll('tr')
			.data(tableData);
		tr.enter().append('tr');
		tr.exit().remove();

		var td = tr.selectAll('td')
			.data(identity);
		td.enter().append('td');
		td.exit().remove();
		td.text(identity);

		createBarChart("Eliminations", tableData);


		var chartSelect = d3.select('#chartSelect');

		var option = chartSelect.selectAll('option')
			.data(headers);
		option.enter().append('option')
			.attr('value', identity);
		option.exit().remove();
		option.text(identity);

		$("#chartSelect").change(function () {
			var category = $(this).val();
			createBarChart(category, tableData);
		});

		function createBarChart(category, data) {

			var chartData = [];

			data.forEach(function (item, index) {
				var obj = {
					"name": data[index][getLegend("Name")],
					"value": parseInt(data[index][getLegend(category)].replace(/,/g, ""))
				}
				chartData.push(obj);
			});

			var width = 800,
				barHeight = 40;

			var x = d3.scale.linear()
				.domain([0, d3.max(chartData, function (d) {
					return d.value;
				})])
				.range([0, width]);

			var chart = d3.select(".chart")
				.attr("width", width)
				.attr("height", barHeight * chartData.length);

			var bar = chart.selectAll("g")
				.data(chartData);
				bar.enter().append("g")
				.attr("transform", function (d, i) {
					return "translate(0," + i * barHeight + ")";
				});

			bar.append("rect")
				.attr("width", function (d) {
					return x(d.value);
				})
				.attr("class", function (d) {
					return d.name;
				})
				.attr("height", barHeight - 1);

			bar.append("text")
				.attr("x", function (d) {
					return x(d.value) - 50;
				})
				.attr("y", barHeight / 2)
				.attr("dy", ".35em")
				.text(function (d) {
					return d.value;
				});

			bar.append("text")
				.attr("x", -50)
				.attr("y", barHeight / 2)
				.attr("dy", ".35em")
				.text(function (d) {
					return d.name;
				});
			bar.exit().remove();
		}
	}

	function getColumns(data) {
		var cols = [];
		for (var key in data) {
			cols.push(key);
		}
	}


})
