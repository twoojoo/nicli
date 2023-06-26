import { parseInputArguments } from "./parseInputArguments"

/**receive the input string, returns the command and the arguments*/
export function getCommandAndArguments(input: string): { command: string, args: string[]} {
	const firstSpaceChar = input.indexOf(" ")

	//command = everything before the first space character
	const command = input.slice(0, firstSpaceChar)	

	//argsString = everything after the first space character
	const argsString = input.slice(firstSpaceChar + 1)

	const args = parseInputArguments(argsString)

	return {
		command,
		args
	}
}