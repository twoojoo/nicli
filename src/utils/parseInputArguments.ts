/**receives the input arguments section (without command) and returns an array of arguments*/
export function parseInputArguments(inputArgsSection: string): string[] {
	const args: string[] = []

	let lastArgStartsAt: number = undefined
	let lastArgDelimiter: string = " "

	for (let i = 0; i < inputArgsSection.length; i++) {
		const char = inputArgsSection.charAt(i)

		if (lastArgStartsAt === undefined) {
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
		} else {
			if (char === lastArgDelimiter) {
				const arg = inputArgsSection.slice(lastArgStartsAt, i)
				args.push(arg)
				lastArgDelimiter = " "
				lastArgStartsAt = undefined
			}
		}
	}

	return args
}