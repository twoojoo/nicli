import { getActualCursorPosition, setCursorPosition } from "./cursor"
import { Choiche, PromptOptions } from "../types"
import { printInput } from "./printInput"

export function deleteCharacterBeforeCursor(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions): string[] {
	const position = getActualCursorPosition(promptLength)
	if (position <= 0) return []
	input.splice(position - 1, 1)
	printInput(prompt, promptLength, input, choiches, options)
	if (input.length == 0) setCursorPosition(0, promptLength)
	else setCursorPosition(position - 1, promptLength)
	return input
}

export function deleteCharacterAfterCursor(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions): string[] {
	const position = getActualCursorPosition(promptLength)
	input.splice(position, 1)
	printInput(prompt, promptLength, input, choiches, options,)
	setCursorPosition(position, promptLength)
	return input
}