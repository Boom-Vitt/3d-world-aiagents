import { readdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';

const codexRoot = process.env.CODEX_HOME || join(homedir(), '.codex');
const skillsRoot = join(codexRoot, 'skills');
const outputPath = join(process.cwd(), 'app', 'data', 'agents.generated.json');
const examplePath = join(process.cwd(), 'app', 'data', 'agents.example.json');

async function writeExampleSnapshot(message) {
  const example = JSON.parse(await readFile(examplePath, 'utf8'));

  await writeFile(
    outputPath,
    `${JSON.stringify({ ...example, generatedAt: new Date().toISOString() }, null, 2)}\n`,
    'utf8',
  );
  console.log(`${message}; using the bundled demo agents.`);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    if (entry.isFile() && entry.name === 'openai.yaml' && dirname(path).endsWith(`${sep}agents`)) {
      files.push(path);
    }
  }

  return files;
}

function readQuotedValue(source, key) {
  const match = source.match(new RegExp(`^\\s*${key}:\\s*["']([^"']+)["']\\s*$`, 'm'));
  return match?.[1]?.trim();
}

function makeId(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9ก-๙]+/g, '-')
    .replace(/^-|-$/g, '');
}

try {
  const files = await walk(skillsRoot);
  const agents = await Promise.all(
    files.map(async (path, index) => {
      const source = await readFile(path, 'utf8');
      const skillDirectory = dirname(dirname(path));
      const skill = skillDirectory.split(sep).at(-1) || `agent-${index + 1}`;
      const name = readQuotedValue(source, 'display_name') || skill;
      const description = readQuotedValue(source, 'short_description') || 'Codex agent';

      return {
        id: makeId(`${skill}-${index}`),
        name,
        skill,
        description,
        system: relative(skillsRoot, path).startsWith(`.system${sep}`),
      };
    }),
  );

  agents.sort((a, b) => Number(a.system) - Number(b.system) || a.name.localeCompare(b.name, 'th'));

  if (agents.length > 0) {
    await writeFile(
      outputPath,
      `${JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          source: '~/.codex/skills/**/agents/openai.yaml',
          agents,
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
    console.log(`Synced ${agents.length} Codex agents.`);
  } else {
    await writeExampleSnapshot('No local Codex agents found');
  }
} catch (error) {
  if (error?.code === 'ENOENT') {
    await writeExampleSnapshot('Local .codex agents are unavailable');
  } else {
    throw error;
  }
}
