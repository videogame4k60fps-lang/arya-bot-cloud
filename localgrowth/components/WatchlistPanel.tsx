'use client';
import { WatchlistItem, Business } from '@/lib/types';
import OpportunityBadge from './OpportunityBadge';

interface Props {
  items: WatchlistItem[];
  onRemove: (placeId: string) => void;
  onGenerate: (b: Business) => void;
  onClose: () => void;
}

export default function WatchlistPanel({ items, onRemove, onGenerate, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Watchlist</h2>
            <p className="text-xs text-gray-500 mt-0.5">{items.length} prospect salvati</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-4xl mb-3">☆</div>
              <p className="text-sm">Nessun prospect salvato</p>
              <p className="text-xs mt-1">Salva le attività più interessanti dalla ricerca</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.business.placeId} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.business.name}</p>
                        <OpportunityBadge score={item.business.opportunityScore} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{item.business.address}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Salvato il {new Date(item.savedAt).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => { onGenerate(item.business); onClose(); }}
                        className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Messaggi
                      </button>
                      <button
                        onClick={() => onRemove(item.business.placeId)}
                        className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
