#! /usr/bin/env node
const { Command } = require("commander");

const { getBranchList, buildAllBranches } = require("./commands/build");
const login = require("./commands/login");
const findUserApps = require("./commands/apps");

const { printError } = require("./utils");
const outputMessages = require("./constants/output-messages");

const program = new Command();

// TODO
// Not sure can not owner build projects
// If authenticated user is not owner then it probably won't work (ofc if user and owner are can be different)
// Because in api you need to put owner but not current user
// But i can't check it now

program
	.name("appcenter")
	.description("CLI for ms appcenter")
	.version("1.0.0", "-v, --vers", "output the current version");

program
	.command("login")
	.description("Command for auth")
	.requiredOption("-t, --token <token>", "User API token")
	.action(async (opt) => {
		try {
			await login(opt.token);
		} catch (e) {
			printError(e.message);
		}
	});

program
	.command("app")
	.description("Get info about application")
	.option("--list", "Show all applications of current user")
	.action(async (opt) => {
		try {
			if (!opt.list) throw Error(outputMessages.argNotFound);

			await findUserApps();
		} catch (e) {
			printError(e.message);
		}
	});

program
	.command("build")
	.description("Build some application")
	.requiredOption("-a, --app <application name>", "Name of application")
	.option("--all", "Building all branches of application")
	.option("--list", "Show all branches of application to build")
	.action(async (options) => {
		try {
			const { app, all, list } = options;
			// TODO checks for options;
  
			// TODO Controller?
			if (all) {
				await buildAllBranches(app);
			} else if (list) {
				await getBranchList(app);
			}
		} catch (e) {
			printError(e.message);
		}
	});


program.parseAsync();
