'use client';

import type { Mode } from '@/types';

interface ModeSelectorProps {
  onSelect: (mode: Mode) => void;
}

export default function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="message-appear mt-2 flex flex-col gap-2 sm:flex-row">
      <button
        onClick={() => onSelect('creative')}
        className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-4 transition-all hover:border-purple-300 hover:bg-purple-50 active:scale-[0.97]"
      >
        <span className="text-3xl">🎨</span>
        <span className="text-sm font-semibold text-gray-800">
          Creative Content
        </span>
        <span className="text-xs text-gray-500">
          Fun, playful & engaging tone
        </span>
      </button>
      <button
        onClick={() => onSelect('trending')}
        className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-4 transition-all hover:border-orange-300 hover:bg-orange-50 active:scale-[0.97]"
      >
        <span className="text-3xl">📈</span>
        <span className="text-sm font-semibold text-gray-800">
          Trending / News Content
        </span>
        <span className="text-xs text-gray-500">
          Informative & professional tone
        </span>
      </button>
    </div>
  );
}
