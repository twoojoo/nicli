import { getCommandAndArguments } from "./utils/getCommandAndArguments";
import { COLORS } from "./utils/colors";

const getCursorPosition = require('get-cursor-position');
const readline = require('readline');

const STDOUT = process.stdout
const STDIN = process.stdin

export const colors = COLORS

export type ChoicheAction = (args: string[]) => any

export type Choiche = {
	command: string,
	description?: string,
	action?: ChoicheAction
}

function parseChoiches(choiches: Choiche[]): Required<Choiche>[] {
	return choiches.map(ch => ({
		description: "",
		action: () => {},
		...ch
	}))
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
	inputColor?: Color[],
	triggerActions?: boolean
	caseSensitive?: boolean
}

function parseOptions(options: PromptOptions): Required<PromptOptions> {
	return {
		suggestionColor: ["FgLightGrey"],
		spaceAfterPrompt: true,
		promptColor: [],
		inputColor: [],
		triggerActions: true,
		caseSensitive: false,
		...options
	}
}

export type ParsedInput = {
	command?: string,
	choiche?: Choiche,
	args: string[]
}

export type PromptInput = ParsedInput & {
	raw?: string
	exit?: boolean
}

let isProcessingAKey: boolean = false
const history: string[][] = []

export async function nicliPrompt(head?: string, choiches: Choiche[] = [], options: PromptOptions = {}): Promise<PromptInput> {
	choiches = parseChoiches(choiches)
	options = parseOptions(options)
	const { prompt, promptLength } = parsePrompt(head, options)

	readline.emitKeypressEvents(STDIN);
	STDIN.setRawMode(true)
	STDIN.resume();

	STDOUT.write(applyColor(prompt, options.promptColor))

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

					STDOUT.write("\n")
					STDIN.removeListener("keypress", keyListener)

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

		STDIN.on("keypress", keyListener)
	})
}

/**position = index of next character in input*/
function getActualCursorPosition(promptLength: number): number {
	const position = (getCursorPosition.sync().col - (promptLength + 1))
	return position
}

function setCursorPosition(position: number, promptLength: number): void {
	if (isNaN(position) || isNaN(promptLength)) return
	if (position < 0) position = 0
	STDOUT.cursorTo(position + (promptLength))
}

function deleteCharacterBeforeCursor(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions): string[] {
	const position = getActualCursorPosition(promptLength)
	if (position <= 0) return []
	input.splice(position - 1, 1)
	// console.log("\n", input, position,"\n\n")
	printInput(prompt, promptLength, input, choiches, options)
	if (input.length == 0) setCursorPosition(0, promptLength)
	else setCursorPosition(position - 1, promptLength)
	return input
}

function deleteCharacterAfterCursor(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions): string[] {
	const position = getActualCursorPosition(promptLength)
	input.splice(position, 1)
	printInput(prompt, promptLength, input, choiches, options,)
	setCursorPosition(position, promptLength)
	return input
}

function printInput(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions) {
	STDOUT.clearLine(0);
	STDOUT.write("\r")
	STDOUT.write(applyColor(prompt, options.promptColor))

	const text = input?.join("") || ""

	if (text.length == 0) {
		setCursorPosition(0, promptLength)
		return
	}

	const choiche = matchChoice(text, choiches, options, true)
	const output = buildOutput(text, choiche, options, promptLength)

	STDOUT.write(output)
	setCursorPosition(text.length, promptLength)
}

function buildOutput(text: string, choiche: Choiche, options: PromptOptions, promptLength: number): string {
	if (!choiche) return applyColor(text, options.inputColor)

	let choicheText = choiche.description ? 
		(choiche.command + " - " + choiche.description).slice(text.length) : 
		choiche.command.slice(text.length)

	const maxOutputLength = process.stdout.columns

	if (promptLength + (text + choicheText).length >= maxOutputLength) {
		choicheText = choicheText.slice(0, maxOutputLength - text.length - promptLength - 1)
		choicheText += "…"
	}

	return applyColor(text, options.inputColor) + applyColor(choicheText, options.suggestionColor)
}

async function parseInput(rawInput: string, choiches: Choiche[], options: PromptOptions): Promise<ParsedInput> {
	if (!rawInput) return

	const { command, args } = getCommandAndArguments(rawInput)

	const choiche = matchChoice(command, choiches, options, false)

	if (options.triggerActions) {
		await choiche?.action(args)
	}

	return {
		command,
		choiche,
		args,
	}
}

function matchChoice(command: string, choiches: Choiche[], options: PromptOptions, partial = false): Choiche {
	if (!partial) {
		if (options.caseSensitive) {
			return choiches.find(c => c.command == command.trim())
		} else {
			return choiches.find(c => c.command.toLowerCase() == command.trim().toLowerCase())
		}
	} else {
		if (options.caseSensitive) {
			return choiches.find(c => c.command.startsWith(command.trim()))
		} else {
			return choiches.find(c => c.command.toLowerCase().startsWith(command.trim().toLowerCase()))
		}
	}
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

