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
```

### Special Keys

- **Ctrl + c**: close the program
- **Up/Down arrows**: move through commands history
- **Tab**: autocomplete (if a command is suggested)

### Options

- **triggerActions**: automatically trigger choiches actions (default: *true*)
- **caseSensitive**: case sensitive while trying to match input with provided choiches (default: *false*)
- **spaceAfterPrompt**: sets a space character between the prompt and the input (default: *true*)
- **suggestionColor**: sets the colors of the suggested commands
- **promptColor**: sets the color of the prompt
- **inputColor**: sets the color of the typed input

## Example

```typescript
import { nicliPrompt, Choiche } from "niclijs"

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
```