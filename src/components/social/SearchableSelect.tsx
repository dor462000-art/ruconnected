import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchableSelectProps {
  options: string[];
  placeholder?: string;
  excluded?: string[];
  onSelect: (value: string) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = 'Search...',
  excluded = [],
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options
    .filter(o => !excluded.includes(o))
    .filter(o => o.toLowerCase().includes(query.toLowerCase()))
    .sort();

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center gap-2 w-full bg-background border border-border rounded-xl px-3 py-2.5">
        <Search size={16} className="text-muted-foreground shrink-0" />
        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-muted-foreground">
            <X size={14} />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-background border border-border rounded-xl shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted-foreground">No matches</p>
          ) : (
            filtered.map(o => (
              <button
                key={o}
                onClick={() => { onSelect(o); setQuery(''); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                {o}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
