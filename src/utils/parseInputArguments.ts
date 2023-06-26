/**receives the input arguments section (without command) and returns an array of arguments*/
export function parseInputArguments(argsString: string): string[] {
	const args: string[] = []

	let lastArgStartsAt: number = undefined
	let lastArgDelimiter: string = " "

	for (let i = 0; i < argsString.length; i++) {
		const char = argsString.charAt(i)

		//if end of args string
		if (i === argsString.length - 1) {
			//and if currently parsing an argument
			if (lastArgStartsAt !== undefined) {
				const lastValidIndex = char == lastArgDelimiter ? i : i + 1
				const arg = argsString.slice(lastArgStartsAt, lastValidIndex)
				args.push(arg)
			}
		} 

		//not currently parsing an argument
		else if (lastArgStartsAt === undefined) {
			if (char === " ") {
				continue
			}

			if (char == "\"") {
				lastArgDelimiter = "\""
				lastArgStartsAt = i + 1
				continue
			}

			if (char == "'") {
				lastArgDelimiter = "'"
				lastArgStartsAt = i + 1
				continue
			}

			else {
				lastArgStartsAt = i
				continue
			}
		} 

		//currently parsing an argument
		else {
			if (char === lastArgDelimiter) {
				const arg = argsString.slice(lastArgStartsAt, i)
				args.push(arg)
				lastArgDelimiter = " "
				lastArgStartsAt = undefined
			}
		}
	}

	return args
}