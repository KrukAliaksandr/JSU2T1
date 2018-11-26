/* eslint-disable no-console */
const todo = require("yargs");
const fs = require("fs");

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
	const jsonObject = require("./" + argv.path + ".json");
	try {
		const validFile = checkForFileContents(argv, jsonObject);
		if (checkForDuplicates(argv, validFile) === 0) {
			writeNote(argv, validFile);
		}
		else {
			throw new Error("Duplicates found! Please change the file");
		}
	} catch (err) {
		console.log(err.message);
	}

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
		const jsonObject = require("./" + argv.path + ".json");
		ListNotes(argv,checkForFileContents(argv, jsonObject));
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
		const jsonObject = require("./" + argv.path + ".json");
		readNote(argv,checkForFileContents(argv, jsonObject));
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
		const jsonObject = require("./" + argv.path + ".json");
		removeNote(argv,checkForFileContents(argv, jsonObject));
	}
	)
	.help()
	.argv;

function checkForFileContents(args, requiredFile) {
	const jsonFile = JSON.stringify(requiredFile);
	console.log(requiredFile);
	if (jsonFile.match(/(\[(\n)*((\t)|( ))*(((\t)|( ))*{\n((\t)|( ))*"[a-z]*": "[a-z]*",\n((\t)|( ))*"[a-z]*": "[a-z]*"\n((\t)|( ))*},*\n*)*(\n)*\]?)/g)) {

		return requiredFile;
	}
	else if (jsonFile.match(/((\t)|( )|(\n))*(((\t)|( )|(\n))*{((\t)|( )|(\n))*"[a-z]*": "[a-z]*",((\t)|( )|(\n))*"[a-z]*": "[a-z]*"((\t)|( )|(\n))*},*((\t)|( )|(\n))*)*/g)){
		let arrayForNotes= [];
		arrayForNotes.push(requiredFile);
		return arrayForNotes;
	}
	// проверка на пустой файл
	// else if (fileStrings.length <= 1 && fileStrings[0].match(/.+/g) === null) {
	// 	requiredFile.push([]);
	// 	fs.writeFileSync(args.path + ".json", JSON.stringify([], null, "\t"), "utf8", () => {
	// 	});
	// 	return requiredFile;
	// }

	else {
		throw new Error("Invalid File contents");
	}
}

function writeNote(args, requiredFile) {
	requiredFile.push({ title: args.title, body: args.body });
	fs.writeFileSync(args.path + ".json", JSON.stringify(requiredFile, null, "\t"), "utf8", () => {
	});
}

function ListNotes(args, requiredFile) {
	requiredFile.forEach(function (node) {
		console.log(node);
	});
}

function readNote(args, requiredFile) {
	const result = requiredFile.filter(function (node) {
		return node.title === args.title;
	});
	(result.length === 0) ? console.log("Nothing") : (console.log(result));
}

function removeNote(args, requiredFile) {
	const result = requiredFile.filter((node) => node.title !== args.title);
	fs.writeFile(args.path + ".json", JSON.stringify(result, null, "\t"), "utf8", () => {
		// eslint-disable-next-line no-console
		console.log(args.title + "successfully Removed");
	});
}

function checkForDuplicates(args, file) {
	const result = file.filter(function (note) {
		return note.title === args.title;
	});
	console.log(result.length + ` notes with title "${args.title}" in file`);
	return result.length;
}

function checkforNotesWithMissingBody(args,file){
	const result = file.filter((note) => !("body" in note));
	result.forEach(note =>
	{
		console.log(`note with ${note.title} + " is missing a body`);
	});
}