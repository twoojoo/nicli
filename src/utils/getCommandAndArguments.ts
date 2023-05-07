import { parseInputArguments } from "./parseInputArguments"

/**receive the input string, returns the command and the arguments*/
export function getCommandAndArguments(input: string): { command: string, args: string[]} {
	const firstSpaceChar = input.indexOf(" ")

	const command = input.slice(0, firstSpaceChar)	

	const argumentsSection = input.slice(firstSpaceChar)
	
	const args = parseInputArguments(argumentsSection)

	return {
		command,
		args
	}
}