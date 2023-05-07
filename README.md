# ▶️ NICLI - Node Interactive (Redis-like) CLIs builder

<br>
<p align="center">
  <img src="./demo.gif" alt="demo gif" />
</p>
<br>

## Install

```bash
npm install niclijs
```

## Basic Usage

Just put the prompt function in an endless loop and react to the returned input. Use **ctrl+c** as exit sequence.

```typescript
import { nicliPrompt } from "niclijs"

(async function () {

	while (true) {
		const { raw, exit } = await nicliPrompt("nicli >")

		if (exit) break

		console.log(">>>", raw)
	}

	process.exit(0)
})()
```

### Returned Input

- **raw**: (*string*) raw typed string
- **command**: (*string*) first word of the input
- **args**: (*strings array*) following words of the input
- **choiche**: (*Choice*) choiche object if the input matches something
- **exit**: (*boolean*) exit signal

### Special Keys

- **Ctrl + c**: return exit signal
- **Ctrl + a**: move the cursor to the first position
- **Ctrl + e**: move the cursor to the last position
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
import { nicliPrompt, Choiche, PromptOptions } from "niclijs"

const choiches: Choiche[] = [{
	command: "SAY_HELLO",
	description: "prints 'hello'",
	action: () => console.log("hello")
}, {
	command: "ECHO",
	description: "prints arguments",
	action: (args) => console.log(...args)
}];

const options: PromptOptions = {
	promptColor: ["FgRed", "BgYellow"],
	inputColor: ["FgYellow"]
};

(async function () {
	while (true) {
		const { command, choiche, exit } = await nicliPrompt("nicli >", choiches, options)
		if (exit) process.exit(0)
		if (!choiche) console.log("unknow command: ", command)
	}	
})()
```

## Next steps

- **Better arguments parsing**: implement the use of quotation marks to allow space char in arguments
- **Smart Autocompletion**: provide arguments in the description and keep suggesting while inserting them

## Known Bugs

- sometimes, when typing fast, the character gets placed at the begining of the input and not on the cursor position
- ~~when suggestion text goes to a new line, so does the cursor (even if it's placed in the right position horizontally)~~ (fixed)