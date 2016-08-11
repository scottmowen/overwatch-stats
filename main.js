$(document).ready(function () {
	var scott = {},
		frank = {},
		jay = {},
		sauce = {},
		rizzo = {},
		dan = {},
		yoseph = {},
		nick = {},
		andy = {},
		stats = {};

	var players = [];
	var sort = "descending";
	var viewingCompetitive = true;

	$('#mode-toggle').bootstrapToggle({
      on: 'Competitive',
      off: 'Quick Play'
    });

	$('#mode-toggle').change(function() {
      if ($(this).prop('checked')) {
		  viewingCompetitive = true;
		  $('.mode-header').text("Competitive");
		  updateDisplay($("#categorySelect").val());
		  $("#chartSelect").change()
	  }
	  else {
		  viewingCompetitive = false;
		  $('.mode-header').text("Quick Play");
		  updateDisplay($("#categorySelect").val());
		  $("#chartSelect").change()
	  }
    })

	$.getJSON("http://scottmowen.com/overwatch-stats/data/stats.json", function (data) {
		scott = data["Scott"];
		frank = data["Frank"];
		jay = data["Jay"];
		sauce = data["Sauce"];
		rizzo = data["Rizzo"];
		dan = data["Dan"];
		yoseph = data["Yoseph"];
		nick = data["Nick"];
		andy = data["Andy"];
		stats = data;

		updateDisplay("Combat");
		$('.table-header').text("Combat");

		$("#chartSelect").change();

	});

	$("#categorySelect").change(function () {
		var category = $(this).val();
		$('.table-header').text(category);

		updateDisplay(category);

		$("#chartSelect").change()
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
			if (player != "undefined") {
				if (viewingCompetitive) {
					obj = stats[player]["competitive"][category];
				}
				else {
					obj = stats[player]["quickplay"][category];
				}
				obj["Name"] = player;
				data.push(obj);
			}
		}


		var convertedData = convertData(data);

		updateTable(convertedData);

		var chartSelect = d3.select('#chartSelect');

		var option = chartSelect.selectAll('option')
			.data(convertedData.legend.slice(1));
		option.enter().append('option');
		option.attr('value', identity)
			.attr('class', 'chart-option');
		option.exit().remove();
		option.text(identity);

		$("#chartSelect").change(function () {
			var category = $(this).val();

			$('.chart-header').text(category);

			createBarChart(category, convertedData);

			setTimeout(function () {
				animateSort();
				/*$divs = $('.bar');

				 var sortedDivs = $divs.sort(function (a, b) {
				 return parseFloat($(a).find(".rect").text()) < parseFloat($(b).find(".rect").text());
				 });

				 $(".chart").html(sortedDivs);*/
			}, 0)
		});

	}


	function animateSort() {
		var promises = [];
		var positions = [];
		var originals = $(".chart").find(".bar");
		var sorted = originals.toArray().sort(function (a, b) {
			if ($(a).find(".rect").text().indexOf(":") == -1) {
				return parseFloat($(a).find(".rect").text()) < parseFloat($(b).find(".rect").text());
			}
			else {
				return convertToSeconds($(a).find(".rect").text()) < convertToSeconds($(b).find(".rect").text());
			}

		});

		originals.each(function () {
			//store original positions
			positions.push($(this).position());
		}).each(function (originalIndex) {
			//change items to absolute position
			var $this = $(this);
			var newIndex = sorted.indexOf(this);
			sorted[newIndex] = $this.clone(); //copy the original item before messing with its positioning
			$this.css("position", "absolute").css("top", positions[originalIndex].top + "px").css("left", positions[originalIndex].left + "px");
			$('.bar').css("background-color", "rgba(24, 34, 62, 0.7)");

			//animate to the new position
			var promise = $this.animate({
				top: positions[newIndex].top + "px",
				left: positions[newIndex].left + "px"
			}, 1000);
			promises.push(promise);
		});

		//instead of leaving the items out-of-order and positioned, replace them in sorted order
		$.when.apply($, promises).done(function () {
			originals.each(function (index) {
				$(this).replaceWith(sorted[index]);
			});
		});
	}

	var sortColumn;

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

		d3.selectAll("thead th").data(data.legend).on("click", function (category) {
			if (sortColumn != category) {
				sort = "descending";
				sortColumn = category;
			}
			tr.sort(function (a, b) {
				if (sort == "ascending") {
					if (category.indexOf("Time") != -1) {
						return (a[data.legend.indexOf(category)] || "0") > (b[data.legend.indexOf(category)] || "0");
					}
					else {
						return parseFloat((a[data.legend.indexOf(category)] || "0").replace(/,/g, "")) > parseFloat((b[data.legend.indexOf(category)] || "0").replace(/,/g, ""));
					}
				}
				else if (sort == "descending") {
					if (category.indexOf("Time") != -1) {
						return (a[data.legend.indexOf(category)] || "0") < (b[data.legend.indexOf(category)] || "0");
					}
					else {
						return parseFloat((a[data.legend.indexOf(category)] || "0").replace(/,/g, "")) < parseFloat((b[data.legend.indexOf(category)] || "0").replace(/,/g, ""));
					}
				}

			});

			$('.statsTable th').removeClass('asc');
			$('.statsTable th').removeClass('desc');
			$('.sort-caret').remove();

			if (sort == "ascending") {
				$(this).addClass('asc');
				$(this).append("<span class='sort-caret'></span>");
				sort = "descending";
			}
			else {
				$(this).addClass('desc');
				$(this).append("<span class='sort-caret'></span>");
				sort = "ascending";
			}
		});
	}

	function convertToSeconds(timeString) {
		var time = timeString.split(':');
		if (time.length == 3) {
			return parseInt(time[0]) * 60 * 60 + parseInt(time[1]) * 60 + parseInt(time[2]);
		}

		if (time.length == 2) {
			return parseInt(time[0]) * 60 + parseInt(time[1]);
		}
	}


	function createBarChart(category, data) {

		var chartData = data.tableData.map(function (item) {
			if (item[data.legend.indexOf(category)] && item[data.legend.indexOf(category)].indexOf(':') != -1) {
				var time = item[data.legend.indexOf(category)];

				var seconds = convertToSeconds(time);

				return {
					"name": item[data.legend.indexOf("Name")],
					"value": seconds,
					"displayVal": item[data.legend.indexOf(category)]
				}
			}
			else {
				return {
					"name": item[data.legend.indexOf("Name")],
					"value": parseFloat((item[data.legend.indexOf(category)] || "0").replace(/,/g, ""))
				}
			}
		});

		var width = $('.chart').width(),
			barHeight = 40;

		var x = d3.scale.linear()
			.domain([0, d3.max(chartData, function (d) {
				return d.value;
			})])
			.range([0, width]);

		var chart = d3.select(".chart")
			.attr("width", width)
			.attr("height", barHeight * chartData.length);

		var bar = chart.selectAll(".bar")
			.data(chartData);

		/*bar.enter().append("g")
		 .attr("transform", function (d, i) {
		 return "translate(0," + i * barHeight + ")";
		 });*/

		bar.exit().remove();
		var newBar = bar.enter().append("div")
			.attr("class", "bar");

		newBar.append("div")
			.attr('class', 'name-text');

		newBar.append("div")
			.attr('class', 'rect');


		/*		bar.attr("transform", function (d, i) {
		 return "translate(0," + i * barHeight + ")";
		 });*/

		bar.select(".rect")
			.style("width", function (d) {
				return x(d.value) + "px";
			})
			.style("min-width", function (d) {
				return "20px";
			})
			.attr("class", function (d) {
				return "rect " + d.name;
			})
			.style("height", barHeight - 1)
			.text(function (d) {
				if (d.displayVal) {
					return d.displayVal;
				}
				else {
					return d.value;
				}
			});

		bar.select(".name-text")
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
