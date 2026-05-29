'use client';
import { useState, FormEvent } from 'react';

interface Props {
  onSearch: (query: string) => void;
  loading: boolean;
}

const SUGGESTIONS = ['Dentisti Milano', 'Palestre Roma', 'Ristoranti Napoli', 'Hotel Firenze', 'Avvocati Torino'];

export default function SearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    onSearch(s);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Es: Dentisti Milano, Palestre Roma, Hotel Firenze..."
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          {loading ? 'Cerco...' : 'Cerca'}
        </button>
      </form>

      <div className="flex gap-2 mt-3 flex-wrap">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => handleSuggestion(s)}
            disabled={loading}
            className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
