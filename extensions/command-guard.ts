// Global dangerous-command guard for Pi.
// Blocks catastrophic bash commands before execution. The denylist is shared
// with every other agent on this machine (Cursor, Claude Code, Codex,
// OpenCode, Hermes): one POSIX-ERE regex per line in
// ~/.agents/hooks/dangerous-patterns.txt. [:space:] is converted to \s.
import { readFileSync } from "node:fs"
import { homedir } from "node:os"

const PATTERNS_FILE = `${homedir()}/.agents/hooks/dangerous-patterns.txt`

function loadPatterns(): RegExp[] {
  try {
    return readFileSync(PATTERNS_FILE, "utf8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .flatMap((line) => {
        try {
          return [new RegExp(line.replaceAll("[:space:]", "\\s"), "m")]
        } catch {
          return [] // skip invalid pattern instead of breaking the agent
        }
      })
  } catch {
    return [] // patterns file unreadable -> fail open
  }
}

export default function (pi: any) {
  pi.on("tool_call", async (event: any) => {
    if (event.toolName !== "bash") return undefined
    const command = String(event.input?.command ?? "")
    if (!command) return undefined
    for (const pattern of loadPatterns()) {
      if (pattern.test(command)) {
        return {
          block: true,
          reason:
            `Blocked by the global dangerous-command guard (~/.agents/hooks/dangerous-patterns.txt). ` +
            `Matched pattern: ${pattern.source}. Do not retry it or try to work around the guard; ` +
            `explain the block to the user instead.`,
        }
      }
    }
    return undefined
  })
}
