import { Choiche, PromptOptions } from "../types"

export function matchChoice(command: string, choiches: Choiche[], options: PromptOptions, partial = false): Choiche {
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
