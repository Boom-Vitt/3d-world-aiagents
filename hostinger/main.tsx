import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import agentsData from '../app/data/agents.generated.json';
import { SiteShell } from '../app/components/site-shell';
import '../app/globals.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Hostinger static entry is missing #root.');
}

createRoot(root).render(
  <StrictMode>
    <SiteShell
      agents={agentsData.agents}
      generatedAt={agentsData.generatedAt}
      source={agentsData.source}
    />
  </StrictMode>,
);
