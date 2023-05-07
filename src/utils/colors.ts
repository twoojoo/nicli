import { Color } from "../types"

export const COLORS = {
	FgBlack: (text: string) => modString(text, "\x1b[30m"),
	FgRed: (text: string) => modString(text, "\x1b[31m"),
	FgGreen: (text: string) => modString(text, "\x1b[32m"),
	FgYellow: (text: string) => modString(text, "\x1b[33m"),
	FgBlue: (text: string) => modString(text, "\x1b[34m"),
	FgMagenta: (text: string) => modString(text, "\x1b[35m"),
	FgCyan: (text: string) => modString(text, "\x1b[36m"),
	FgWhite: (text: string) => modString(text, "\x1b[37m"),
	FgLightGrey: (text: string) => modString(text, "\x1b[90m"),

	BgBlack: (text: string) => modString(text, "\x1b[40m"),
	BgRed: (text: string) => modString(text, "\x1b[41m"),
	BgGreen: (text: string) => modString(text, "\x1b[42m"),
	BgYellow: (text: string) => modString(text, "\x1b[43m"),
	BgBlue: (text: string) => modString(text, "\x1b[44m"),
	BgMagenta: (text: string) => modString(text, "\x1b[45m"),
	BgCyan: (text: string) => modString(text, "\x1b[46m"),
	BgWhite: (text: string) => modString(text, "\x1b[47m"),

	Bright: (text: string) => modString(text, "\x1b[1m"),
	Dim: (text: string) => modString(text, "\x1b[2m"),
	Underscore: (text: string) => modString(text, "\x1b[4m"),
	Blink: (text: string) => modString(text, "\x1b[5m"),
	Reverse: (text: string) => modString(text, "\x1b[7m"),
	Hidden: (text: string) => modString(text, "\x1b[8m")
}

function modString(string: string, modder: string) {
	return modder + string + `\x1b[0m`
}


export function applyColor(text: string, colors?: Color[]) {
	if (!colors) return text
	return colors.reduce((acc, c) => COLORS[c](acc), text)
}