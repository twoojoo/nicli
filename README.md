# ▶️ NICLI - Node Interactive (Redis-like) CLIs builder

<br>
<p align="center">
  <img src="./demo.gif" alt="demo" />
</p>
<br>

## Install

```bash
npm install niclijs
```

## Usage

Just put the prompt function in an endless loop and react to the returned input. Use **ctrl+c** as exit sequence.

```typescript
import { prompt } from "niclijs"

(async function () {
	while (true) {
		const input = await nicliPrompt(" NYCLY ▶️ ", [{ 
			command: "MYCOMMAND",
			description: "my command description"
		}], {
			promptColor: ["FgRed", "BgYellow"],
			inputColor: ["FgYellow"]
		})

		console.log(">>>", input)
	}
})()
```

### Options

- **spaceAfterPrompt**: sets a space character between the prompt and the input (default: true)
- **suggestionColor**: sets the colors of the suggested commands
- **promptColor**: sets the color of the prompt
- **inputColor**: sets the color of the typed input
- **tabSpaces**: number of spaces that compose a *tab* character (default: 4)