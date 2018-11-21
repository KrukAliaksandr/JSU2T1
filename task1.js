/* eslint-disable no-console */
const wow = require("yargs");
const fs = require("fs");
const path = require("path");

wow.command(
	"todo",
	"makes and action with a file",
	function (yargs) {
		return yargs.options({
			"path": {
				alias: "p",
				describe: "path to file",
				demandOption: true
			},
			"action": {
				alias: "a",
				describe: "action for file",
				demandOption: true
			},
			"title": {
				alias: "t",
				describe: "node title",
			},
			"body": {
				alias: "b",
				describe: "node body",
			}
		});
	},

	function (argv) {
		switch (argv.action) {
		case "Add": checkArgs(argv);
			addNodeToFile(argv);
			break;
		case "List": checkArgs(argv);
			listAllNodes(argv);
			break;
		case "Read": checkArgs(argv);
			readNodeFromFile(argv);
			break;
		case "Remove": checkArgs(argv);
			removeNodeFromFile(argv);
			break;
		}
	}
)
	.help()
	.argv;

function addNodeToFile(argv) {
	// eslint-disable-next-line no-console
	fs.writeFile(argv.path + ".json", JSON.stringify({ title: argv.title, body: argv.body }), "utf8", () => {
		// eslint-disable-next-line no-console
		console.log(argv.path + "successfully written");
	});
}

function listAllNodes(argv) {
	const jsonObject = require("./" + argv.path + ".json");
	jsonObject.forEach(function (node) {
		console.log(node);
	});
}

function readNodeFromFile(argv) {
	const jsonObject = require("./" + argv.path + ".json");
	const result = jsonObject.filter(function (node) {
		return node.title === argv.title;
	});
	console.log(result);
}

function removeNodeFromFile(argv) {
	const jsonObject = require("./" + argv.path + ".json");
	const result = jsonObject.forEach(function (node) {
		if (node.title === argv.title) delete jsonObject[node];
	});
	fs.writeFile(argv.path + ".json", JSON.stringify(result), "utf8", () => {
		// eslint-disable-next-line no-console
		console.log(argv.path + "successfully written");
	});
}

function checkArgs(argv) {
	if (argv.action === "Add") {
		if (argv.title === undefined || argv.body === undefined) {
			throw new Error();
		}
		if ((argv.action === "Read" || argv.action === "Remove") && argv.title === undefined) {
			throw new Error();
		}
	}
}