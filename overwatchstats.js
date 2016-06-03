var title, value;
var result = {};
var json = {};
var featured = {};

json.gamertag =  $('.header-masthead').text();

switch (json.gamertag) {
	case "KI Scottworth":
		json.name = "Scott";
		break;
	case "jaytay4589":
		json.name = "Jay";
		break;
	case "Soresukai":
		json.name = "Frank";
		break;
	case "The Sauce":
		json.name = "Sauce";
		break;
	case "Rizzo H2P":
		json.name = "Rizzo";
		break;
	case "Rizzo H2P":
		json.name = "Rizzo";
		break;
	case "Mr DANgerous03":
		json.name = "Dan";
		break;
	case "Yoble 7":
		json.name = "Yosef";
		break;
	case "LordRurisk":
		json.name = "Nick";
		break;
	case "FBallPlaya":
		json.name = "Andy";
		break;
	default:
		//do nothing

}

$('.card-content').each(function () {
	var data = $(this);
	title = data.children('.card-copy').text();
	value = data.children('.card-heading').text();

	featured[title] = value;
})

json["featured"] = featured;

$('.card-stat-block').each(function () {
	var data = $(this);

	var statBlock = {};

	var statName = data.children('.data-table').children('thead').children('tr').children('th').text();

	data.children('.data-table').children('tbody').children('tr').each(function () {
		var stats = $(this);

		var key, value;

		key = stats.children('td').first().text();
		value = stats.children('td').last().text();

		statBlock[key] = value;
	})
	json[statName] = statBlock;
})

result = json;

