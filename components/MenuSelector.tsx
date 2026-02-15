'use client';

import type { Tool } from '@/types';

const MENU_ITEMS: { label: string; tool?: Tool; emoji: string; action: string }[] = [
  { label: 'Generate Caption', tool: 'Caption Generator', emoji: '✍️', action: 'caption' },
  { label: 'Generate Hashtags', tool: 'Hashtag Generator', emoji: '#️⃣', action: 'hashtags' },
  { label: 'Viral Post Idea', tool: 'Viral Post Ideas', emoji: '🚀', action: 'viral' },
  { label: 'Hook Generator', tool: 'Hook Generator', emoji: '🪝', action: 'hook' },
  { label: 'Improve My Caption', tool: 'Improve Caption', emoji: '✨', action: 'improve' },
  { label: 'Best Posting Time', tool: 'Best Posting Time', emoji: '⏰', action: 'time' },
  { label: "What's Trending in My Niche 🔥", tool: 'Trending Topics', emoji: '📊', action: 'trending' },
  { label: 'Change Niche', emoji: '🔄', action: 'change-niche' },
  { label: 'Change Mode', emoji: '🔀', action: 'change-mode' },
];

interface MenuSelectorProps {
  onSelectTool: (tool: Tool) => void;
  onChangeNiche: () => void;
  onChangeMode: () => void;
}

export default function MenuSelector({
  onSelectTool,
  onChangeNiche,
  onChangeMode,
}: MenuSelectorProps) {
  const handleClick = (item: (typeof MENU_ITEMS)[number]) => {
    if (item.action === 'change-niche') {
      onChangeNiche();
    } else if (item.action === 'change-mode') {
      onChangeMode();
    } else if (item.tool) {
      onSelectTool(item.tool);
    }
  };

  return (
    <div className="message-appear mt-2">
      <div className="flex flex-col gap-1.5">
        {MENU_ITEMS.map((item, index) => (
          <button
            key={item.action}
            onClick={() => handleClick(item)}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.99]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
              {index + 1}
            </span>
            <span className="text-base">{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
