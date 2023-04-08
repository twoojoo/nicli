import { prompt } from "."

(async function () {
	while (true) {
		const input = await prompt(" NYCLY ▶️ ", [{ 
			command: "ENQUEUE",
			description: "enqueue an item"
		}], {
			promptColor: ["FgRed", "BgYellow"],
			inputColor: ["FgYellow"]
		})
		
		console.log("COMMAND:", input)
	}

})()