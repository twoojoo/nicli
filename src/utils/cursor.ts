const getCursorPosition = require('get-cursor-position');

/**position = index of next character in input*/
export function getActualCursorPosition(promptLength: number): number {
	const position = (getCursorPosition.sync().col - (promptLength + 1))
	return position
}

export function setCursorPosition(position: number, promptLength: number): void {
	if (isNaN(position) || isNaN(promptLength)) return
	if (position < 0) position = 0
	process.stdout.cursorTo(position + (promptLength))
}
