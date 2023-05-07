import { getCommandAndArguments } from "./getCommandAndArguments"
import { Choiche, ParsedInput, PromptOptions } from "../types"
import { matchChoice } from "./choices"

export async function parseInput(rawInput: string, choiches: Choiche[], options: PromptOptions): Promise<ParsedInput> {
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

