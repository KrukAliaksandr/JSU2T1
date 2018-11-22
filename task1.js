/* eslint-disable no-console */
const todo = require("yargs");
const fs = require("fs");
const path = require("path");

todo.command(
	"Add",
	"makes an action with a file",
	function (yargs) {
		return yargs.options({
			"path": {
				alias: "p",
				describe: "path to file",
				demandOption: true
			},
			"title": {
				alias: "t",
				describe: "node title",
				demandOption: true
			},
			"body": {
				alias: "b",
				describe: "node body",
				demandOption: true
			}
		});
	},

	function (argv) {
		checkArgs(argv);
		addNoteToFile(argv);

	}
)
	.help()
	.argv;

todo.command(
	"List",
	"makes an action with a file",
	function (yargs) {
		return yargs.options({
			"path": {
				alias: "p",
				describe: "path to file",
				demandOption: true
			}
		});
	},

	function (argv) {
		checkArgs(argv);
		listAllNotes(argv);
	}
)
	.help()
	.argv;

todo.command(
	"Read",
	"makes an action with a file",
	function (yargs) {
		return yargs.options({
			"path": {
				alias: "p",
				describe: "path to file",
				demandOption: true
			},
			"title": {
				alias: "t",
				describe: "node title",
				demandOption: true
			}
		});
	},

	function (argv) {
		checkArgs(argv);
		readNoteFromFile(argv);
	}
)
	.help()
	.argv;

todo.command(
	"Remove",
	"makes an action with a file",
	function (yargs) {
		return yargs.options({
			"path": {
				alias: "p",
				describe: "path to file",
				demandOption: true
			},
			"title": {
				alias: "t",
				describe: "node title",
				demandOption: true
			}
		});
	},

	function (argv) {
		checkArgs(argv);
		removeNoteFromFile(argv);
	}
)
	.help()
	.argv;

function addNoteToFile(argv) {
	// eslint-disable-next-line no-console]
	const jsonObject = fs.readFileSync(argv.path + ".json","utf8");
	console.log(jsonObject);
	const fileStrings = jsonObject.split("\r\n");
	console.log(fileStrings.length);
	if (fileStrings.length === 1 && fileStrings[0].match(/{(.*)}/g)=== null) {
		fs.writeFile(argv.path + ".json", JSON.stringify([{ title: argv.title, body: argv.body }],null,"\t"), "utf8", () => {
			console.log(argv.path + " successfully written");
		});
	} 
	// else if(fileStrings[0].match(/{(.*)}/g)!== null && fileStrings[fileStrings.length-1].match(/{(.*)}/g)!== null ||
	// fileStrings[0].match(/{.*/g)!== null && fileStrings[fileStrings.length-1].match(/.*}/g)!== null ){
	// 	fileStrings.push("]");
	// 	fileStrings.unshift("[");
	// 	fs.writeFile(argv.path + ".json", JSON.stringify([{fileStrings}],null,"\t"), "utf8", () => {
	// 		console.log(argv.path + " successfully corrected");
	// 	});
	// }
	if (jsonObject.match(/(\[\n?((\t)|( ))*(((\t)|( ))*{\n((\t)|( ))*"[a-z]*": "[a-z]*",\n((\t)|( ))*"[a-z]*": "[a-z]*"\n((\t)|( ))*},*\n*)*\n\]?)/g)) {
		let jsonStrings = JSON.parse(jsonObject);
		console.log(jsonObject);
		console.log(jsonStrings);
		jsonStrings.push({ title: argv.title, body: argv.body });
		console.log(jsonStrings);
		fs.writeFile(argv.path + ".json", JSON.stringify(jsonStrings,null,"\t"), "utf8", () => {
			// eslint-disable-next-line no-console
			console.log(argv.path + "successfully written");
		});
	}

}

function listAllNotes(argv) {
	const jsonObject = require("./" + argv.path + ".json");
	jsonObject.forEach(function (node) {
		console.log(node);
	});
}

function readNoteFromFile(argv) {
	const jsonObject = require("./" + argv.path + ".json");
	console.log(jsonObject.length);
	const result = jsonObject.filter(function (node) {
		return node.title === argv.title;
	});
	console.log(result);
}

function removeNoteFromFile(argv) {
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
		if (typeof argv.title === "undefined" || typeof argv.body === "undefined") {
			throw new Error();
		}
		if ((argv.action === "Read" || argv.action === "Remove") && typeof argv.title === "undefined") {
			throw new Error();
		}
	}
}
