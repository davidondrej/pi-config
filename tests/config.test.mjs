import assert from 'node:assert/strict';
import { readFileSync, readdirSync, lstatSync, realpathSync } from 'node:fs';
import { resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const json = path => JSON.parse(read(path));
const settings = json('config/settings.example.json');
const models = json('config/models.example.json');
const expectedModels = [
  'google/gemini-3.8-flash:nitro', 'z-ai/glm-5.2:nitro', 'openai/gpt-5.6-sol',
  'moonshotai/kimi-k3', 'moonshotai/kimi-k3:nitro',
];

function checkFields(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!/^(apiKey|headers|authorization|password|token|secret|oauth)$/i.test(key), `Unexpected credential field: ${key}`);
    if (key === 'baseUrl') assert.equal(child, 'https://openrouter.ai/api/v1');
    checkFields(child);
  }
}

test('model configuration contains only the five approved public OpenRouter models', () => {
  assert.deepEqual(Object.keys(models.providers), ['openrouter']);
  assert.deepEqual(models.providers.openrouter.models.map(m => m.id), expectedModels);
  checkFields(models);
  for (const model of models.providers.openrouter.models) {
    assert.ok(model.contextWindow > 0 && model.maxTokens > 0);
    assert.equal(model.compat.thinkingFormat, 'openrouter');
  }
});

test('coding and compaction defaults resolve to declared models', () => {
  assert.equal(settings.defaultProvider, 'openrouter');
  assert.equal(settings.defaultModel, 'moonshotai/kimi-k3');
  assert.equal(settings.defaultThinkingLevel, 'high');
  assert.deepEqual(settings.compactionModel, {
    model: 'openrouter/google/gemini-3.8-flash:nitro', thinkingLevel: 'high',
  });
  assert.ok(expectedModels.includes(settings.defaultModel));
  assert.ok(expectedModels.includes(settings.compactionModel.model.slice('openrouter/'.length)));
  checkFields(settings);
});

test('only the three reviewed version-pinned public packages are configured', () => {
  assert.deepEqual(settings.packages, [
    'npm:pi-web-access@0.10.7', 'npm:@benvargas/pi-openai-fast@1.0.5', 'npm:pi-compaction-model@0.1.0',
  ]);
});

test('shared preferences preserve the reviewed values without credentials', () => {
  assert.equal(settings.theme, 'dark');
  assert.equal(settings.retry.provider.timeoutMs, 600000);
  assert.equal(settings.httpIdleTimeoutMs, 600000);
  assert.deepEqual(json('config/web-search.example.json'), { workflow: 'none' });
  const fast = json('config/pi-openai-fast.example.json');
  assert.equal(fast.active, true);
  assert.equal(fast.persistState, true);
  checkFields(fast);
  for (const model of fast.supportedModels) assert.match(model, /^openai(?:-codex)?\/gpt-/);
});

test('prompts contain only short and the explicitly approved unchanged stage command', () => {
  assert.deepEqual(readdirSync(resolve(root, 'prompts')).sort(), ['short.md', 'stage.md']);
  assert.equal(read('prompts/stage.md'), '---\ndescription: Stage all files & push to GitHub\n---\nStage all files & push to GitHub.\n');
  assert.match(read('docs/setup.md'), /no built-in review or confirmation step/);
});

test('sanitized prompt uses the latest APPEND_SYSTEM rewrite, not deleted instructions', () => {
  assert.equal(read('config/APPEND_SYSTEM.example.md'), [
    '- No emojis.',
    '- Reply in English unless the user writes in another language.',
    '- Never log, echo, or print secrets or `.env` token values.',
    "- To add Pi prompt rules, edit `APPEND_SYSTEM.md`. Do not replace `SYSTEM.md`; that file replaces Pi's defaults.",
    '',
  ].join('\n'));
});

test('contributor symlinks are internal and resolve, not links into a private home', () => {
  for (const path of ['CLAUDE.md', 'config/CLAUDE.md', 'extensions/CLAUDE.md', 'tests/CLAUDE.md', '.claude/skills']) {
    assert.ok(lstatSync(resolve(root, path)).isSymbolicLink());
    const destination = relative(root, realpathSync(resolve(root, path)));
    assert.ok(!destination.startsWith('..') && !isAbsolute(destination));
  }
});
