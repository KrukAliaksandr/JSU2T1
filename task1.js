/* eslint-disable no-console */
const todo = require("yargs");
const fs = require("fs");
const path = require("path");

todo.command("Add", "makes an action with a file", function (yargs) {
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
	checkForFileContents(argv);
	writeNote(argv);

})
	.command("List", "makes an action with a file", function (yargs) {
		return yargs.options({
			"path": {
				alias: "p",
				describe: "path to file",
				demandOption: true
			}
		});
	},
	function (argv) {
		checkForFileContents(argv);
		ListNotes(argv);
	}
	)
	.command("Read", "makes an action with a file", function (yargs) {
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
		checkForFileContents(argv);
		readNote(argv);
	}
	)
	.command("Remove", "makes an action with a file", function (yargs) {
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
		checkForFileContents(argv);
		removeNote(argv);
	}
	)
	.help()
	.argv;

function checkForFileContents(args) {
	let jsonObject = fs.readFileSync(args.path + ".json", "utf8");
	const fileStrings = jsonObject.split("\r\n");
	//проверка на правильно записанный файл с notes
	if (jsonObject.match(/(\[(\n)?((\t)|( ))*(((\t)|( ))*{\n((\t)|( ))*"[a-z]*": "[a-z]*",\n((\t)|( ))*"[a-z]*": "[a-z]*"\n((\t)|( ))*},*\n*)*(\n)*\]?)/g)) {
		return true;
	}
	// проверка на пустой файл
	else if (fileStrings.length <= 1 && fileStrings[0].match(/.+/g) === null) {
		fs.writeFileSync(args.path + ".json", JSON.stringify([], null, "\t"), "utf8", () => {
		});
		return true;
	}
	else {
		throw new Error("Invalid File contents");
	}
}

function writeNote(args) {
	const jsonObject = require("./" + args.path + ".json");
	jsonObject.push({ title: args.title, body: args.body });
	fs.writeFileSync(args.path + ".json", JSON.stringify(jsonObject, null, "\t"), "utf8", () => {
	});
}

function ListNotes(args) {
	const jsonObject = require("./" + args.path + ".json");
	jsonObject.forEach(function (node) {
		console.log(node);
	});
}

function readNote(args) {
	const jsonObject = require("./" + args.path + ".json");
	const result = jsonObject.filter(function (node) {
		return node.title === args.title;
	});
	(result.length===0)?console.log("Nothing"):(console.log(result));
}

function removeNote(args) {
	const jsonObject = fs.require(args.path + ".json", "utf8");
	const result = jsonObject.filter((node) => node.title !== args.title);
	fs.writeFile(args.path + ".json", JSON.stringify(result, null, "\t"), "utf8", () => {
		// eslint-disable-next-line no-console
		console.log(args.title + "successfully Removed");
	});
}
//@TODO Проверить на дубликаты