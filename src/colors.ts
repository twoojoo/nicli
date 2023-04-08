export const COLORS = {
	FgBlack: (text: string) => editString(text, "\x1b[30m"),
	FgRed: (text: string) => editString(text, "\x1b[31m"),
	FgGreen: (text: string) => editString(text, "\x1b[32m"),
	FgYellow: (text: string) => editString(text, "\x1b[33m"),
	FgBlue: (text: string) => editString(text, "\x1b[34m"),
	FgMagenta: (text: string) => editString(text, "\x1b[35m"),
	FgCyan: (text: string) => editString(text, "\x1b[36m"),
	FgWhite: (text: string) => editString(text, "\x1b[37m"),
	FgLightGrey: (text: string) => editString(text, "\x1b[90m"),

	BgBlack: (text: string) => editString(text, "\x1b[40m"),
	BgRed: (text: string) => editString(text, "\x1b[41m"),
	BgGreen: (text: string) => editString(text, "\x1b[42m"),
	BgYellow: (text: string) => editString(text, "\x1b[43m"),
	BgBlue: (text: string) => editString(text, "\x1b[44m"),
	BgMagenta: (text: string) => editString(text, "\x1b[45m"),
	BgCyan: (text: string) => editString(text, "\x1b[46m"),
	BgWhite: (text: string) => editString(text, "\x1b[47m"),

	Bright: (text: string) => editString(text, "\x1b[1m"),
	Dim: (text: string) => editString(text, "\x1b[2m"),
	Underscore: (text: string) => editString(text, "\x1b[4m"),
	Blink: (text: string) => editString(text, "\x1b[5m"),
	Reverse: (text: string) => editString(text, "\x1b[7m"),
	Hidden: (text: string) => editString(text, "\x1b[8m"),

}

function editString(string: string, code: string) {
	return code + string + `\x1b[0m`
}