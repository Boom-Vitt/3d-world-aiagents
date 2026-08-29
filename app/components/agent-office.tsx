'use client';

import { useMemo, useState } from 'react';
import { AgentWorld } from './agent-world';

export type AgentProfile = {
  id: string;
  name: string;
  skill: string;
  description: string;
  system: boolean;
};

const activity = ['กำลังสำรวจ', 'กำลังสร้าง', 'พร้อมรับงาน'] as const;

export function AgentOffice({ agents }: { agents: AgentProfile[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(agents[0]?.id ?? null);
  const [paused, setPaused] = useState(false);
  const selected = useMemo(
    () => agents.find((agent) => agent.id === selectedId) ?? null,
    [agents, selectedId],
  );
  const customCount = agents.filter((agent) => !agent.system).length;

  return (
    <>
      <AgentWorld
        agents={agents}
        paused={paused}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onTogglePause={() => setPaused((value) => !value)}
      />

      <aside className="roster" aria-labelledby="roster-title">
        <div className="roster-head">
          <div>
            <p className="eyebrow">TEAM ROSTER · SIMULATED ACTIVITY</p>
            <h2 id="roster-title">เอเจนต์ในออฟฟิศ</h2>
          </div>
          <span>{customCount} + {agents.length - customCount}</span>
        </div>
        <div className="roster-list">
          {agents.map((agent, index) => (
            <button
              className="agent-row"
              data-selected={selectedId === agent.id}
              key={agent.id}
              type="button"
              onClick={() => setSelectedId(agent.id)}
              aria-pressed={selectedId === agent.id}
            >
              <span className="agent-index">{String(index + 1).padStart(2, '0')}</span>
              <span className="agent-orb" data-system={agent.system} />
              <span className="agent-copy">
                <strong>{agent.name}</strong>
                <small>{activity[index % activity.length]}</small>
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="agent-detail" aria-live="polite">
            <span className="detail-label">SELECTED AGENT</span>
            <strong>{selected.name}</strong>
            <p>{selected.description}</p>
            <code>{selected.system ? '.system/' : 'skills/'}{selected.skill}</code>
          </div>
        )}
      </aside>
    </>
  );
}
