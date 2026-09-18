# pi-config

David Ondrej's [Pi Agent](https://pi.dev) settings, model choices, prompts, and command guard.

- **Coding:** Kimi K3 through OpenRouter, high thinking.
- **Compaction:** Gemini 3.8 Flash Nitro through OpenRouter, high thinking.
- **Extras:** public package recommendations, optional prompts, and cmux/Herdr setup instructions.

## Get started

Read the **[setup guide](docs/setup.md)**. Back up your current config, then merge only the pieces you want. Use your own credentials. See [public skills](https://github.com/davidondrej/skills) separately.

## Repository

Public files only; Git metadata and ignored local audit files are omitted.

```text
pi-config/
├── README.md
├── LICENSE
├── .gitignore
├── AGENTS.md
├── CLAUDE.md → AGENTS.md
├── .agents/
│   └── skills/
│       └── .gitkeep
├── .claude/
│   └── skills → ../.agents/skills
├── config/
│   ├── AGENTS.md
│   ├── CLAUDE.md → AGENTS.md
│   ├── settings.example.json
│   ├── models.example.json
│   ├── pi-openai-fast.example.json
│   ├── web-search.example.json
│   ├── global-instructions.example.md
│   └── APPEND_SYSTEM.example.md
├── docs/
│   ├── setup.md
│   └── adr/
│       └── 0001-local-repository-location.md
├── extensions/
│   ├── AGENTS.md
│   ├── CLAUDE.md → AGENTS.md
│   ├── command-guard.ts
│   └── dangerous-patterns.txt
├── prompts/
│   ├── short.md
│   └── stage.md
└── tests/
    ├── AGENTS.md
    ├── CLAUDE.md → AGENTS.md
    ├── command-guard.test.mjs
    └── config.test.mjs
```

## Before applying

- `/stage` requests staging **all files and pushing to GitHub**. It has no built-in confirmation.
- The command guard is **not a sandbox**; missing rules let commands through.
- Model limits and pricing change. Read the guide's tuning warnings, especially for Kimi's output limit and Nitro priority pricing.

## Tests

Requires Node.js 22.19.0+. No API keys needed; dangerous-command fixtures are never executed.

```sh
node --test tests/*.test.mjs
```

[MIT license](LICENSE).
