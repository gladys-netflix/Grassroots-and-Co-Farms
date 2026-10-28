import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface NotificationBarProps {
  onNavigateToArugula?: () => void;
}

export const NotificationBar: React.FC<NotificationBarProps> = ({ onNavigateToArugula }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#1B3523] text-stone-200 text-xs py-2 px-4 border-b border-emerald-950/40 relative z-30 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto text-center truncate">
          <span className="font-semibold text-emerald-300 tracking-wide uppercase text-[10px] sm:inline hidden">
            #1 Top Sale
          </span>
          <span className="text-stone-300 truncate">
            Signature Wild Arugula from Balas, Bacolor · Harvested daily at 5:30 AM dawn
          </span>
          {onNavigateToArugula && (
            <button
              type="button"
              onClick={onNavigateToArugula}
              className="ml-1 text-amber-300 hover:text-amber-200 underline font-semibold transition-colors cursor-pointer shrink-0"
            >
              Explore Special Arugula Page →
            </button>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-stone-400 hover:text-white transition-colors shrink-0 p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 cursor-pointer"
          aria-label="Dismiss harvest announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
