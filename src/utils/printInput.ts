import { Choiche, PromptOptions } from "../types";
import { setCursorPosition } from "./cursor";
import { matchChoice } from "./choices";
import { applyColor } from "./colors";

export function printInput(prompt: string, promptLength: number, input: string[], choiches: Choiche[], options: PromptOptions) {
	process.stdout.clearLine(0);
	process.stdout.write("\r")
	process.stdout.write(applyColor(prompt, options.promptColor))

	const text = input?.join("") || ""

	if (text.length == 0) {
		setCursorPosition(0, promptLength)
		return
	}

	const choiche = matchChoice(text, choiches, options, true)
	const output = buildOutput(text, choiche, options, promptLength)

	process.stdout.write(output)
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