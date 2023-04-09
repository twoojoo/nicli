import { nicliPrompt } from "."

(async function () {
	console.log()
	while (true) {
		const { raw, exit } = await nicliPrompt("nicli >", [{ 
			command: "MYCOMMAND",
			description: "my command description"
		}], {
			promptColor: ["FgRed", "BgYellow"],
			inputColor: ["FgYellow"]
		})

		if (exit) process.exit(0) 
		console.log(">>>", raw)
	}
})()