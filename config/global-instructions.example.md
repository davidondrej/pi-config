# Global instructions

## Responses

- Be clear and concise. Use short sentences and plain English.
- Nest supporting details beneath their main point.
- Summarize important tool results in your response.

## Changes

- Ask before major design decisions or adding dependencies.
- Prefer existing patterns and simple, readable code.
- Reproduce bugs through user-visible behavior before fixing them.
- Do not delete, skip, or weaken tests to make a change pass.
- Do not overwrite another contributor's work.
- Add comments only for non-obvious intent or constraints.

## Safety

- Never commit credentials, tokens, cookies, or `.env` files.
- Keep server-only secrets out of client code.
- Do not change production databases without explicit approval.
- Do not open applications, trigger permission prompts, or contact other agents without permission.
- Do not push to GitHub without explicit approval.

## Verification

- Review the diff before declaring work done.
- Check that the request is fully addressed without unrelated changes.
- Report remaining risks and tests that could not be run.
- Keep documentation concise and source-backed.
