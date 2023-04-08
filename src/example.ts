import { nicliPrompt, Choiche } from "."

const choiches: Choiche[] = [{
	command: "SAY_HELLO",
	description: "prints 'hello'",
	action: () => console.log("hello")
}, {
	command: "ECHO",
	description: "prints something",
	action: (args: string) => console.log(args)
}];

(async function () {
	while (true) {
		const { command, choiche, args } = await nicliPrompt("NYCLY ▶️ ", choiches)
		if (choiche) choiche.action(args)
		else console.log("unknow command: ", command)
	}	
})()