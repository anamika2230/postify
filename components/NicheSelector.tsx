'use client';

import type { Niche } from '@/types';

const NICHES: { label: Niche; emoji: string }[] = [
  { label: 'Fitness', emoji: '💪' },
  { label: 'Tech', emoji: '💻' },
  { label: 'Fashion', emoji: '👗' },
  { label: 'Travel', emoji: '✈️' },
  { label: 'Education', emoji: '📚' },
  { label: 'Business', emoji: '💼' },
  { label: 'Gaming', emoji: '🎮' },
  { label: 'News / Current Affairs', emoji: '📰' },
  { label: 'Other', emoji: '✨' },
];

interface NicheSelectorProps {
  onSelect: (niche: Niche) => void;
}

export default function NicheSelector({ onSelect }: NicheSelectorProps) {
  return (
    <div className="message-appear mt-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {NICHES.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => onSelect(label)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.97]"
          >
            <span className="text-lg">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
