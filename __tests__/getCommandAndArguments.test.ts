import { getCommandAndArguments } from "../src/utils/getCommandAndArguments"

test("parse-input-args", () => {
	const result = getCommandAndArguments("my_command first   second   \"third\"    'four\"\"\"th'  \"fi'fth\" ")

	expect(result.command).toBe("my_command")

	expect(result.args[0]).toBe("first")
	expect(result.args[1]).toBe("second")
	expect(result.args[2]).toBe("third")
	expect(result.args[3]).toBe("four\"\"\"th")
	expect(result.args[4]).toBe("fi'fth")
})