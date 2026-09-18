# Command guard

- Keep the adapter and patterns together; the adapter loads `~/.agents/hooks/dangerous-patterns.txt`.
- Tests must inspect command strings without executing them. Run `node --test tests/*.test.mjs` from the repo root.
- Document fail-open behavior and coverage limits. Do not present regex matching as a sandbox.
