import { nicliPrompt } from "./index"
import { randomInt } from "crypto"

(async function () {
	while (true) {
		const length = randomInt(10) + 5
		let prompt = ""
		for (let i = 0; i <length; i++) prompt += "-"
		const { raw, exit } = await nicliPrompt(prompt, [{ 
			command: "MYCOMMAND",
			description: "my command description",
		},{ 
			command: "MY_LONG_COMMAND",
			description: "my very long longest longer bla bla bla bla aaaaaaaaaaaaaaaaaaaaaaaaaaac description",
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