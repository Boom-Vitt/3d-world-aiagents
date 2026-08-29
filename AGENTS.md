# Codex Agent World repository guidance

## Project setup

- Use Node.js 22.13 or newer.
- Install dependencies with `npm install`.
- Start the local world with `npm run dev`.
- Run `npm run lint` and `npm run build:hostinger` after changing application code.

## Local agent data

- `npm run sync:agents` discovers agent descriptors under `$CODEX_HOME/skills/**/agents/openai.yaml`; `CODEX_HOME` defaults to `~/.codex`.
- Treat `app/data/agents.generated.json` as private, generated local data. Never add it to Git.
- Keep `app/data/agents.example.json` generic and free of personal or organization-specific information.
- Never copy prompts, credentials, environment variables, conversation history, or the user's `.codex` directory into this repository.

## Source changes

- Preserve the static Hostinger entry point in `hostinger/` and the OpenAI Sites entry point in `app/`.
- Keep the agent snapshot shape compatible with `app/components/site-shell.tsx`.
- Prefer focused changes and document new public setup steps in `README.md`.
