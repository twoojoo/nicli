import { nicliPrompt, Choiche } from "."

const commands: Choiche[] = [{
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
		const input = await nicliPrompt("NYCLY ▶️ ", commands)
		const command = input.split(" ")[0]
		const args = input.split(command + " ")[1] || ""
		const action = commands.find(c => c.command == command)?.action
		if (action) action(args)
		else console.log("unknow command")
	}	
})()