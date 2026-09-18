# Tests

- Run `node --test tests/*.test.mjs` from the repository root with Node.js 22.19.0+.
- Guard fixtures are inert strings. Never execute them or use real credentials, sessions, or live configuration.
- Keep fail-open limitations explicit; tests must not imply sandbox coverage.
