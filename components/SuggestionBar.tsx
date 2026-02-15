'use client';

import type { Tool } from '@/types';

interface SuggestionBarProps {
  onSelectTool: (tool: Tool) => void;
  onMainMenu: () => void;
}

const SUGGESTIONS: { label: string; tool?: Tool; action: string }[] = [
  { label: '# Hashtags', tool: 'Hashtag Generator', action: 'tool' },
  { label: '✨ Improve Caption', tool: 'Improve Caption', action: 'tool' },
  { label: '🚀 Viral Idea', tool: 'Viral Post Ideas', action: 'tool' },
  { label: '📊 Trending', tool: 'Trending Topics', action: 'tool' },
  { label: '📋 Main Menu', action: 'menu' },
];

export default function SuggestionBar({
  onSelectTool,
  onMainMenu,
}: SuggestionBarProps) {
  return (
    <div className="message-appear mt-3">
      <p className="mb-2 text-xs font-medium text-gray-500">
        Want to continue?
      </p>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              if (item.action === 'menu') {
                onMainMenu();
              } else if (item.tool) {
                onSelectTool(item.tool);
              }
            }}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-95"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
