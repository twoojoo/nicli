import { nicliPrompt, Choiche, PromptOptions } from "../src"

const choiches: Choiche[] = [{
	command: "SAY_HELLO",
	description: "prints 'hello'",
	action: () => console.log("hello")
}, {
	command: "ECHO",
	description: "prints arguments",
	action: (args) => console.log(...args)
}];

const options: PromptOptions = {
	// promptColor: ["FgRed", "BgYellow"],
	// inputColor: ["FgYellow"]
};

console.log();
(async function () {
	while (true) {
		const { command, choiche, exit } = await nicliPrompt("nicli >", choiches, options)
		if (exit) process.exit(0)
		if (!choiche) console.log("unknow command: ", command)
	}	
})()