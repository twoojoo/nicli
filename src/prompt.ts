import { Choiche, Key, PromptInput, PromptOptions, parseChoiches, parseOptions } from "./types";
import { deleteCharacterAfterCursor, deleteCharacterBeforeCursor } from "./utils/deleteCharacter";
import { matchChoice } from "./utils/choices";
import { applyColor } from "./utils/colors";
import { getActualCursorPosition, setCursorPosition } from "./utils/cursor";
import { parsePrompt } from "./utils/parsePrompt";
import { printInput } from "./utils/printInput";
import { parseInput } from "./utils/parseInput";

const readline = require('readline');

let isProcessingAKey: boolean = false
const history: string[][] = []

export async function nicliPrompt(head?: string, choiches: Choiche[] = [], options: PromptOptions = {}): Promise<PromptInput> {
	choiches = parseChoiches(choiches)
	options = parseOptions(options)
	const { prompt, promptLength } = parsePrompt(head, options)

	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true)
	process.stdin.resume();

	process.stdout.write(applyColor(prompt, options.promptColor))

	let input: string[] = []
	let historyIndex = history.length 

	return new Promise<PromptInput>((resolve) => {
		const keyListener = async (char: string, key: Key) => {
			if (isProcessingAKey) return	
			isProcessingAKey = true

			if (key.sequence)
				//exit
				if (key.ctrl && key.name == "c") {
					resolve({ exit: true, args: [] })
				} 

				else if (key.ctrl && key.name == "a") {
					printInput(prompt, promptLength, input, choiches, options)
					setCursorPosition(0, promptLength)
				} 

				else if (key.ctrl && key.name == "e") {
					printInput(prompt, promptLength, input, choiches, options)
					setCursorPosition(input.length, promptLength)
				} 

				//cursor
				else if (key.name == "left") {
					const left = getActualCursorPosition(promptLength) - 1
					setCursorPosition(left, promptLength)
				} else if (key.name == "right") {
					const right = getActualCursorPosition(promptLength) + 1
					setCursorPosition(right, promptLength)
				} 

				//history
				else if (key.name == "up") {
					historyIndex = historyIndex == 0 ? 0 : historyIndex - 1
					input = history[historyIndex] || []
					printInput(prompt, promptLength, input, choiches, options)
				} else if (key.name == "down") {
					if (historyIndex >= history.length) input = []
					else {
						historyIndex += 1
						input = history[historyIndex] || []
					}
					printInput(prompt, promptLength, input, choiches, options)
				} 

				//confirm
				else if (key.name == "return") {
					printInput(prompt, promptLength, input, [], options)

					process.stdout.write("\n")
					process.stdin.removeListener("keypress", keyListener)

					isProcessingAKey = false
					history.push(input)
					const text = input.join("")

					resolve({
						...(await parseInput(text, choiches, options)),
						raw: text
					})
				}

				//autocomplete
				else if (key.name == "tab") {
					const text = input.join("")
					const choiche = matchChoice(text, choiches, options, true)
					if (choiche) input = choiche.command.split("").concat([" "])
					printInput(prompt, promptLength, input, choiches, options)
					setCursorPosition(choiche?.command?.length + 1 || 0, promptLength)
				} 

				//typing
				else if (key.name == "backspace") {
					input = deleteCharacterBeforeCursor(prompt, promptLength, input, choiches, options) 
				} else if (key.name == "delete") {
					input = deleteCharacterAfterCursor(prompt, promptLength, input, choiches, options) 
				} else if (char) {
					const position = getActualCursorPosition(promptLength)
					input.splice(position, 0, char)
					printInput(prompt, promptLength, input, choiches, options)
					setCursorPosition(position + 1, promptLength)
				}

			isProcessingAKey = false
		}

		process.stdin.on("keypress", keyListener)
	})
}