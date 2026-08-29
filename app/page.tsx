import agentsData from './data/agents.generated.json';
import { SiteShell } from './components/site-shell';

export default function Home() {
  return (
    <SiteShell
      agents={agentsData.agents}
      generatedAt={agentsData.generatedAt}
      source={agentsData.source}
    />
  );
}
