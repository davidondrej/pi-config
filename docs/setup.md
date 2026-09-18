# Pi config

A reviewed snapshot of David Ondrej's Pi preferences. Start here. Apply only the parts you want; this is not an installer, a complete home-folder backup, or an active Pi package.

## Before you start

- Reference Pi version: **0.85.1**. It requires **Node.js 22.19.0+**. Check `node --version` and `pi --version`.
- Work as your normal user, not root. Pi's default agent directory is `~/.pi/agent`; respect `PI_CODING_AGENT_DIR` if you changed it.
- Back up files you plan to edit somewhere outside this checkout. Keep credentials and backups private.
- Do not copy entire directories over your existing setup. Merge settings by key, model arrays by ID, and package lists without duplicates. Inspect trusted project `.pi/settings.json` overrides too.
- Extensions run with your account's permissions. Pi project trust is not a sandbox. Read third-party source before installing.

If Pi is not installed, the official npm package is:

```sh
npm install -g --ignore-scripts @earendil-works/pi-coding-agent@0.85.1
```

This pins the reference version, not a promise that it is the latest release. Use your existing Pi installation rather than installing a second one.

## Settings and models

Manually merge the following templates into the matching locations. Do not copy this checkout's contributor `AGENTS.md` files into your global prompt.

- `config/models.example.json` → `<agent-dir>/models.json`
- `config/settings.example.json` → `<agent-dir>/settings.json`
- `config/pi-openai-fast.example.json` → `<agent-dir>/extensions/pi-openai-fast.json`
- `config/web-search.example.json` → `~/.pi/web-search.json` (the web-access package's separate path)
- `config/global-instructions.example.md` → selected rules in `<agent-dir>/AGENTS.md`
- `config/APPEND_SYSTEM.example.md` → selected rules in `<agent-dir>/APPEND_SYSTEM.md`

The settings example uses **Kimi K3 / high** for coding and **Gemini 3.8 Flash Nitro / high** for compaction. It also carries the dark theme and 10-minute provider-request and HTTP-idle timeouts. These timeouts are preferences, not performance targets or a total job deadline.

### Model tuning warnings

The five OpenRouter entries preserve the reviewed machine's current tuning. They are examples, not universal recommendations:

- Gemini Flash Nitro: 1,048,576-token context, 65,536 output ceiling, low/medium/high reasoning supported. Compaction selects **high** separately in settings.
- GLM 5.2 Nitro: 1,048,576-token context and a conservative 32,768 output ceiling. OpenRouter currently advertises high/xhigh reasoning. The example adds xhigh but does not hide every unsupported Pi level; avoid assuming every level in the picker is accepted.
- GPT-5.6 Sol: 1,050,000-token context and 128,000 output ceiling, with xhigh/max mappings. Large-context usage can increase charges; check current provider pricing.
- Both Kimi K3 entries: 1,048,576-token context and a configured 1,048,576 output ceiling. **OpenRouter advertised a lower 943,718 output limit when checked on 2026-09-17.** This deliberate snapshot preserves the selected tuning, not a validated output limit. Lower the ceiling to a currently supported value before relying on very long outputs. The reasoning map exposes off/low/high/max, with off mapped to none.
- `:nitro` sorts for throughput and permits priority endpoints. It can cost more. The example cost fields are static estimates and do not reliably reflect the served priority tier or future pricing.

Check the [live OpenRouter catalog](https://openrouter.ai/api/v1/models) and [Nitro routing docs](https://openrouter.ai/docs/guides/routing/model-variants/nitro) before adoption. No private providers, credential commands, or non-OpenRouter model overrides are included.

### Authentication

Run `/login` in Pi and configure OpenRouter using your own account, or provide `OPENROUTER_API_KEY` through your private environment/secrets manager. Never paste credentials into this repo or example files. The templates intentionally omit API keys and do not change `auth.json`.

## Public packages

These are the reviewed installed versions. Install each explicitly rather than copying `node_modules` or cached Git checkouts:

```sh
pi install npm:pi-web-access@0.10.7
pi install npm:@benvargas/pi-openai-fast@1.0.5
pi install npm:pi-compaction-model@0.1.0
```

Do not duplicate an existing package entry. Pinned packages require an explicit version change to update. Check their source and release notes before upgrading.

- [pi-web-access](https://www.npmjs.com/package/pi-web-access): search and content tools. The included `workflow: "none"` skips the automatic curator. Browser-cookie access remains opt-in in this version; do not enable it without understanding the privacy and Keychain implications.
- [pi-openai-fast](https://www.npmjs.com/package/@benvargas/pi-openai-fast): `/fast` enables priority requests for configured OpenAI models. The optional example starts enabled. Priority can increase billing or subscription usage; `/fast off` disables it. This list does not add or change your coding model.
- [pi-compaction-model](https://github.com/JMHSV/pi-compaction-model): routes manual, threshold, and overflow compaction to the configured model. It preserves Pi's normal summary format and recent-message retention. If the model is missing, authentication fails, or compaction fails, the extension warns and falls back to the active coding model. Avoid another compaction extension handling the same events.

Higher compaction thinking can take longer. No fixed latency or summary-quality guarantee is implied by this setup. Verify the new model on a disposable conversation before using it for important work.

## Optional prompts

Copy selected files from `prompts/` into `<agent-dir>/prompts/` after checking for name conflicts:

- `short.md`: `/short` requests a simpler, shorter answer.
- **`stage.md`: `/stage` expands exactly to “Stage all files & push to GitHub.”** This is intentionally unchanged. It can lead an agent to publish unrelated changes or secrets. It has no built-in review or confirmation step. Install it only if you accept that behavior. The command guard does **not** block ordinary pushes or inspect staged files for secrets.

## Optional command guard

Two files are required:

- `extensions/dangerous-patterns.txt` → `~/.agents/hooks/dangerous-patterns.txt`
- `extensions/command-guard.ts` → `<agent-dir>/extensions/command-guard.ts`

The patterns path is fixed in the adapter, even with a custom Pi agent directory. If you already have shared guard rules there, review and merge them; do not replace another agent's rules blindly. Review both files before installing, and copy the rules before the extension.

The unchanged guard examines the named `bash` tool's command text before execution. Its patterns cover common destructive filesystem/disk commands, force pushes, remote deletions, and credential-extraction commands.

**Limits:** missing or unreadable rules allow commands; invalid patterns are skipped. It does not parse shell syntax, scan files, constrain arbitrary code execution, or cover differently named tools such as PowerShell. It can miss obfuscated commands and block harmless quoted text. Some dangerous actions, including normal pushes and force-with-lease, remain allowed. This is an accident guard, not isolation or a complete security policy.

Run the tests from the checkout:

```sh
node --test tests/*.test.mjs
```

Tests use a temporary home directory, inspect inert command strings, and never run the dangerous examples. They do not use API keys or make model calls.

## Optional integrations and skills

Install the apps from their official sources. Do not copy their generated extension files from somebody else's machine.

- [cmux](https://github.com/manaflow-ai/cmux): after installation, run `cmux hooks pi install` in your own terminal. On macOS, if the CLI is not on PATH, use `/Applications/cmux.app/Contents/Resources/bin/cmux`. cmux owns and updates its Pi integration.
- [Herdr](https://github.com/ogulcancelik/herdr): after installation, run `herdr integration install pi`, then use Pi inside Herdr. Herdr owns and updates its integration. Check current `--help` if your app version differs.
- [David's public skills](https://github.com/davidondrej/skills): choose skills there and follow their setup requirements. The local private skill library is not copied here.

These are optional host integrations, not required dependencies of the config or guard.

## Activate, verify, and remove

1. Run `/reload` in Pi, or restart. If the web-access configuration changed, restart Pi as its package recommends.
2. Check `/model`, `/thinking`, `/fast status`, and `pi list`. Model selection should stay on your chosen coding model.
3. In a disposable conversation, try `/compact` after enough history exists. Check for `pi-compaction-model` fallback warnings rather than assuming a successful compact used Gemini.
4. Review whether trusted project settings override your global examples.

To undo: restore your own settings backup or remove only the keys, model IDs, prompts, and extension you added. Remove the public packages with `pi remove npm:<package-name>` only if you no longer need them. Remove shared guard rules only if no other agent uses them. Use each app's own integration uninstall command for cmux/Herdr. Do not delete sessions or credentials.

Portable files are stored directly in this repo. No links into the author's home folder are shipped. There is no synchronization daemon, automatic commit, or automatic push.

## Sources

- [Pi settings](https://pi.dev/docs/latest/settings), [models](https://pi.dev/docs/latest/models), [packages](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md)
- [Extensions](https://pi.dev/docs/latest/extensions), [prompt templates](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/prompt-templates.md), [security](https://pi.dev/docs/latest/security)

Local preparation verified against Pi 0.85.1 and the package versions listed above. Platform integration commands were checked against installed CLI help; no app integration was installed or modified as part of preparing this repo.
