import { nicliPrompt, Choiche } from "."

const choiches: Choiche[] = [{
	command: "SAY_HELLO",
	description: "prints 'hello'",
	action: () => console.log("hello")
}, {
	command: "ECHO",
	description: "prints arguments",
	action: (args) => console.log(...args)
}];

(async function () {
	while (true) {
		const { command, choiche } = await nicliPrompt("NYCLY ▶️ ", choiches)
		if (!choiche) console.log("unknow command: ", command)
	}	
})()