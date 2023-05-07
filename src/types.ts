import { COLORS } from "./utils/colors"

export type ChoicheAction = (args: string[]) => any

export type Choiche = {
	command: string,
	description?: string,
	action?: ChoicheAction
}

export type Key = {
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

export type ParsedInput = {
	command?: string,
	choiche?: Choiche,
	args: string[]
}

export type PromptInput = ParsedInput & {
	raw?: string
	exit?: boolean
}

export function parseChoiches(choiches: Choiche[]): Required<Choiche>[] {
	return choiches.map(ch => ({
		description: "",
		action: () => {},
		...ch
	}))
}

export function parseOptions(options: PromptOptions): Required<PromptOptions> {
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
