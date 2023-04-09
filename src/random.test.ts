import { nicliPrompt } from "./index.test"
import { randomInt } from "crypto"

(async function () {
	while (true) {
		const length = randomInt(10) + 5
		let prompt = ""
		for (let i = 0; i <length; i++) prompt += "-"
		const { raw, exit } = await nicliPrompt(prompt, [{ 
			command: "MYCOMMAND",
			description: "my command description"
		}], {
			promptColor: ["FgRed", "BgYellow"],
			inputColor: ["FgYellow"],
			spaceAfterPrompt: false
		})

		if (exit) break
		console.log(">>>", raw)
	}

	process.exit(0)
})()