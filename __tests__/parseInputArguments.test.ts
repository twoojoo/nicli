import { parseInputArguments } from "../src/utils/parseInputArguments"

test("parse-input-args", () => {
	const result = parseInputArguments("first   second   \"third\"    'four\"\"\"th'  \"fi'fth\" ")

	expect(result[0]).toBe("first")
	expect(result[1]).toBe("second")
	expect(result[2]).toBe("third")
	expect(result[3]).toBe("four\"\"\"th")
	expect(result[4]).toBe("fi'fth")
})