var fs = require('fs'),
	util = require('util'),
	express = require('express'),
	request = require('request'),
	cheerio = require('cheerio'),
	wscraper = require('wscraper');

var app = express();

var urls = [
	"/en-us/career/xbl/KI%20Scottworth",
	"/en-us/career/xbl/Soresukai",
	"/en-us/career/xbl/The%20Sauce",
	"/en-us/career/xbl/Rizzo%20H2P",
	"/en-us/career/xbl/jaytay4589",
	"/en-us/career/xbl/Mr%20DANgerous03",
	"/en-us/career/xbl/Yoble%207",
	"/en-us/career/xbl/LordRurisk",
	"/en-us/career/xbl/FBallPlaya"
];


var statsObj = {};
var script = fs.readFileSync('overwatchstats.js');


var agent = wscraper.createAgent();

agent.on('start', function (n) {
	util.log('[wscraper.js] agent has started; ' + n + ' path(s) to visit');
});

agent.on('done', function (url, data) {
	util.log('[wscraper.js] data from ' + url);
	// display the results
	util.log('[wscraper.js] data scraped for ' + data.name);

	statsObj[data.name] = data;

	fs.writeFile('data/' + data.name + ".json", JSON.stringify(data, null, 4), function (err) {

		console.log('File successfully written! - Check your project directory for the json file');
		// next item to process if any
		agent.next();

	})

});

agent.on('stop', function (n) {
	util.log('[wscraper.js] agent has ended; ' + n + ' path(s) remained to visit');

	fs.writeFile('data/stats.json', JSON.stringify(statsObj, null, 4), function (err) {

		console.log('File successfully written! - Check your project directory for the stats.json file');

	});
});

agent.on('abort', function (e) {
	util.log('[wscraper.js] getting a FATAL ERROR [' + e + ']');
	util.log('[wscraper.js] agent has aborted');
	process.exit();
});

agent.start('playoverwatch.com', urls, script)
exports = module.exports = app;