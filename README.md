# Codex Agent World

An open-source 3D office that visualizes the AI agents available in your local Codex installation. Every person who clones the repository gets their own world, generated from agent metadata on their computer.

รีโปนี้เป็น Public และใช้ MIT License ทุกคนสามารถ clone, ปรับแต่ง และรันกับ Codex ในเครื่องของตัวเองได้

## Quick start

Requirements: Node.js 22.13 or newer and npm. Codex is optional for the demo, but required to load your own local agents.

```bash
git clone https://github.com/Boom-Vitt/3d-world-aiagents.git
cd 3d-world-aiagents
npm install
npm run dev
```

Open the local URL shown in the terminal. The startup script scans:

```text
$CODEX_HOME/skills/**/agents/openai.yaml
```

When `CODEX_HOME` is not set, it defaults to `~/.codex`. If local agent descriptors are unavailable, the website uses a small bundled demo office instead.

After adding or changing a Codex skill, refresh the snapshot and reload the page:

```bash
npm run sync:agents
```

## Use from local Codex

Open this repository as your Codex project, or start Codex from the cloned directory:

```bash
codex
```

Example request:

```text
Run my local Codex Agent World and verify that it shows the agents from my Codex skills folder.
```

Codex reads the repository's `AGENTS.md` for project-specific setup and safety guidance.

## Privacy

- Only `display_name`, `short_description`, the skill folder name, and whether the skill is a system skill are placed in the local snapshot.
- Prompts, credentials, environment variables, conversations, and source files are not copied into the website.
- `app/data/agents.generated.json` is generated locally and ignored by Git.
- Do not commit your `~/.codex` directory or local generated snapshot.

## Hostinger static build

```bash
npm install
npm run build:hostinger
```

Upload the **contents** of `hostinger-dist/` directly to `public_html`. Do not upload the enclosing `hostinger-dist` folder. For Hostinger Git deployment, the `hostinger` branch already contains deployment-ready files with `index.html` at the repository root.

## OpenAI Sites build

```bash
npm run build
```

This creates the Vinext/Cloudflare Worker output in `dist/`. Do not upload that output to Hostinger `public_html`.

## License

MIT — see [LICENSE](LICENSE).
