import { AgentOffice, type AgentProfile } from './agent-office';
import { WORLD_CONFIG } from '../world-config';

type SiteShellProps = {
  agents: AgentProfile[];
  generatedAt: string;
  source: string;
};

export function SiteShell({ agents, generatedAt, source }: SiteShellProps) {
  return (
    <main
      className="agent-app"
      style={
        {
          '--world-bg': WORLD_CONFIG.colors.background,
          '--world-surface': WORLD_CONFIG.colors.surface,
          '--world-primary': WORLD_CONFIG.colors.primary,
          '--world-secondary': WORLD_CONFIG.colors.secondary,
          '--world-accent': WORLD_CONFIG.colors.accent,
          '--world-text': WORLD_CONFIG.colors.text,
        } as React.CSSProperties
      }
    >
      <header className="topbar">
        <a className="brand" href="#world" aria-label="Codex Agent World หน้าแรก">
          <span className="brand-mark">C</span>
          <span>
            <strong>CODEX</strong>
            <small>AGENT WORLD</small>
          </span>
        </a>
        <div className="sync-status"><span /> ซิงก์จาก .codex แล้ว</div>
      </header>

      <section className="world-layout" id="world">
        <div className="world-heading">
          <p className="eyebrow">LOCAL INTELLIGENCE · LIVE OFFICE</p>
          <h1>โลกออฟฟิศของ<br />AI Agent ทุกตัว</h1>
          <p className="intro">
            เปลี่ยนเอเจนต์ใน <code>~/.codex</code> ให้กลายเป็นทีม 3D ที่มองเห็นและสำรวจได้
          </p>
          <div className="agent-count" aria-label={`พบเอเจนต์ทั้งหมด ${agents.length} ตัว`}>
            <strong>{String(agents.length).padStart(2, '0')}</strong>
            <span>AGENTS<br />DETECTED</span>
          </div>
        </div>

        <AgentOffice agents={agents} />
      </section>

      <footer className="source-note">
        <span>DATA SOURCE</span>
        <code>{source}</code>
        <time dateTime={generatedAt}>LOCAL SNAPSHOT</time>
      </footer>
    </main>
  );
}
