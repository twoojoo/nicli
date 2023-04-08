# ▶️ NICLI - Node Interactive (Redis-like) CLIs builder

## Install

```bash
npm install nicli
```

## Usage

```typescript
import { prompt } from "nicli"

(async function () {
	while (true) {
		const input = await prompt(" NYCLY ▶️ ", [{ 
			command: "MYCOMMAND",
			description: "my command description"
		}], {
			promptColor: ["FgRed", "BgYellow"],
			inputColor: ["FgYellow"]
		})

		console.log(">>>", input)
	}
})()
```