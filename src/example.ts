import { nicliPrompt, Choiche, PromptOptions } from "."

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
	promptColor: ["FgRed", "BgYellow"],
	inputColor: ["FgYellow"]
};

(async function () {
	while (true) {
		const { command, choiche } = await nicliPrompt("NYCLY ▶️ ", choiches, options)
		if (!choiche) console.log("unknow command: ", command)
	}	
})()