// ToolCard.tsx — clean 2026 design
'use client';

import React from 'react';
import Link from 'next/link';
import { TOOL_CATEGORY_ICONS } from '@/lib/toolsRegistry';
import type { Tool } from '@/lib/toolsRegistry';

const DIFFICULTY_STYLES = {
  beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function ToolCard({ tool }: { tool: Tool }) {
  const icon = TOOL_CATEGORY_ICONS[tool.category] || '🛠️';

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block p-5 rounded-xl border border-zinc-800 hover:border-indigo-500/50 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
              {tool.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${DIFFICULTY_STYLES[tool.difficulty]}`}>
              {tool.difficulty}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mb-3 line-clamp-2">{tool.tagline}</p>
          <span className="text-xs text-indigo-400 font-medium group-hover:underline">
            Try free →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ToolGrid({ tools, columns = 3 }: { tools: Tool[]; columns?: 2 | 3 | 4 }) {
  const grid = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return (
    <div className={`grid ${grid[columns]} gap-3`}>
      {tools.map((t) => <ToolCard key={t.id} tool={t} />)}
    </div>
  );
}