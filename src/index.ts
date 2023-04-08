const getCursorPosition = require('get-cursor-position');
const readline = require('readline');
import { COLORS } from "./colors";

const STDOUT = process.stdout
const STDIN = process.stdin

export type Choiche = {
	command: string,
	description?: string,
	[x: string]: any
}

type Key = {
	sequence: string,
	name: string,
	ctrl: boolean,
	meta: boolean,
	shift: boolean
}

export type Color = keyof typeof COLORS

export type PromptOptions = {
	spaceAfterPrompt?: boolean,
	suggestionColor?: Color[]
	promptColor?: Color[]
	inputColor?: Color[]
	// tabSpaces?: number
}

function parseOptions(options: PromptOptions): Required<PromptOptions> {
	return {
		suggestionColor: ["FgLightGrey"],
		spaceAfterPrompt: true,
		promptColor: [],
		inputColor: [],
		...options
	}
}


let isProcessingAKey: boolean = false
const history: string[][] = []

export async function nicliPrompt(head?: string, choiches: Choiche[] = [], options: PromptOptions = {}): Promise<string> {
	options = parseOptions(options)
	const { prompt, promptLength } = parsePrompt(head, options)
		
	readline.emitKeypressEvents(STDIN);
	STDIN.setRawMode(true)
	STDIN.resume();

	STDOUT.write(applyColor(prompt, options.promptColor))

	let input: string[] = []
	let historyIndex = history.length 

	return new Promise<string>((resolve) => {
		const keyListener = (char: string, key: Key) => {
			if (isProcessingAKey) return	
			isProcessingAKey = true

			if (key.sequence)
				if (key.name == "up") {
					historyIndex = historyIndex == 0 ? 0 : historyIndex - 1
					input = history[historyIndex]
					printInput(prompt, promptLength, input, choiches, options)
				} else if (key.name == "down") {
					if (historyIndex >= history.length) input = []
					else {
						historyIndex += 1
						input = history[historyIndex] || []
					}
					printInput(prompt, promptLength, input, choiches, options)
				} else 
				if (key.name == "left") {
					const left = getCursorPosition.sync().col - 2
					if (left > promptLength - 3) STDOUT.cursorTo(left)
				} else if (key.name == "right") {
					const right = getCursorPosition.sync().col
					STDOUT.cursorTo(right)
				} else if (key.name == "return") {
					printInput(prompt, promptLength, input, [], options)
					STDOUT.write("\n")
					STDIN.removeListener("keypress", keyListener)
					isProcessingAKey = false
					history.push(input)
					resolve(input.join(""))
				} else if (key.ctrl && key.name == "c") {
					exit()
				} else if (key.name == "backspace") {
					input = deleteCharacterBeforeCursor(prompt, promptLength, input, choiches, options) 
				} else if (key.name == "delete") {
					input = deleteCharacterAfterCursor(prompt, promptLength, input, choiches, options) 
				} else if (key.name == "tab") {
					const text = input.join("")
					const choiche = choiches.find(c => c.command.toLowerCase().startsWith(text.toLowerCase()))
					if (choiche) input = [choiche.command + " "]
					printInput(prompt, promptLength, input, choiches, options)
					setCursorPosition(choiche.command.length, promptLength)
				} else if (char) {
					const position = getActualCursorPosition(promptLength)
					input.splice(position, 0, char)
					printInput(prompt, promptLength, input, choiches, options)
					setCursorPosition(position, promptLength)
				}

			isProcessingAKey = false
		}

		STDIN.on("keypress", keyListener)
	})
}

/**position = index of next character in input*/
function getActualCursorPosition(promptLength: number): number {
	const position = (getCursorPosition.sync().col - (promptLength - 1))
	return position >= 1 ? position : 0
}

function setCursorPosition(position: number, promptLength: number): void {
	if (isNaN(position) || isNaN(promptLength)) return
	if (position < -1) position = -1
	if (position < 1) STDOUT.cursorTo(position + (promptLength - 1))
	else STDOUT.cursorTo(position + (promptLength - 1))
}

function deleteCharacterBeforeCursor(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions): string[] {
	const position = getActualCursorPosition(promptLength)
	if (position <= 0) return []
	input.splice(position - 1, 1)
	printInput(prompt, promptLength, input, choiches, options)
	if (input.length == 0) setCursorPosition(-1, promptLength)
	else setCursorPosition(position - 2, promptLength)
	return input
}

function deleteCharacterAfterCursor(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions): string[] {
	const position = getActualCursorPosition(promptLength)
	input.splice(position, 1)
	printInput(prompt, promptLength, input, choiches, options,)
	setCursorPosition(position - 1, promptLength)
	return input
}

function printInput(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions) {
	STDOUT.clearLine(0);
	STDOUT.write("\r")
	STDOUT.write(applyColor(prompt, options.promptColor))

	const text = input.join("")

	if (text.length == 0) {
		setCursorPosition(0, promptLength)
		return
	}

	const choiche = choiches.find(c => c.command.toLowerCase().startsWith(text.toLowerCase()))
	const output = buildOutput(text, choiche, options)

	STDOUT.write(output)
	setCursorPosition(text.length, promptLength)
}

function buildOutput(text: string, choiche: Choiche, options: PromptOptions): string {
	if (!choiche) return applyColor(text, options.inputColor)
	const choicheText = (choiche.command + " - " + choiche.description).slice(text.length)
	return applyColor(text, options.inputColor) + applyColor(choicheText, options.suggestionColor)
}



function exit(code: number = 0) {
	STDOUT.write("\n")
	process.exit(code)
}

function applyColor(text: string, colors: Color[]) {
	return colors.reduce((acc, c) => COLORS[c](acc), text)
}

function parsePrompt(prompt: string, options: PromptOptions): { prompt: string, promptLength: number } {
	let promptLength = prompt.length

	if (options.promptColor.length == 0) prompt = `\x1b[0m` + prompt + '\x1b[0m'
	prompt = applyColor(prompt.toString(), options.promptColor)

	if (options.spaceAfterPrompt) {
		prompt += " "
		promptLength++
	}
	return { prompt, promptLength }
}