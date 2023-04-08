# ▶️ NICLI - Node Interactive (Redis-like) CLIs builder

<br>
<p align="center">
  <img src="demo.gif" alt="demo" />
</p>
<br>

## Install

```bash
npm install nicli
```

## Usage

Just put the prompt function in an endless loop and react to the returned input. Use **ctrll+c** as exit sequence.

```typescript
import { prompt } from "nicli"

(async function () {
	while (true) {
		const input = await prompt(" NYCLY ▶️ ", [{ 
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

**spaceAfterPrompt**: sets a space character between the prompt and the input (default: true)

**suggestionColor**: sets the colors of the succested commands

**promptColor**: sets the color of the prompt

**inputColor**: sets the color of the typed input

**tabSpaces**: number of spaces that compose a *tab* character (default: 4)