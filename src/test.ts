import { nicliPrompt } from "."

(async function () {
	while (true) {
		const { raw } = await nicliPrompt(" NYCLY ▶️ ", [{ 
			command: "MYCOMMAND",
			description: "my command description"
		}], {
			promptColor: ["FgRed", "BgYellow"],
			inputColor: ["FgYellow"]
		})

		console.log(">>>", raw)
	}
})()