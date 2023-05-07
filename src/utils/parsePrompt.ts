import { PromptOptions } from "../types"
import { applyColor } from "./colors"

export function parsePrompt(prompt: string, options: PromptOptions): { prompt: string, promptLength: number } {
	let promptLength = prompt.length

	if (options.promptColor.length == 0) prompt = `\x1b[0m` + prompt + '\x1b[0m'
	prompt = applyColor(prompt.toString(), options.promptColor)

	if (options.spaceAfterPrompt) {
		prompt += " "
		promptLength++
	}
	return { prompt, promptLength }
}

