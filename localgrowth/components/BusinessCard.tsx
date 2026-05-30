import { Business } from '@/lib/types';
import OpportunityBadge from './OpportunityBadge';

interface Props {
  business: Business;
  onGenerate: (b: Business) => void;
  onSave: (b: Business) => void;
  isGenerating: boolean;
  isSaved: boolean;
}

export default function BusinessCard({ business, onGenerate, onSave, isGenerating, isSaved }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm">{business.name}</h3>
            <OpportunityBadge score={business.opportunityScore} />
          </div>

          <p className="text-xs text-gray-500 mt-1 truncate">{business.address}</p>

          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {business.rating !== undefined ? (
              <span className="text-xs text-gray-600">
                ⭐ {business.rating}
                {business.reviewCount !== undefined && ` (${business.reviewCount})`}
              </span>
            ) : (
              <span className="text-xs text-gray-400">⭐ Nessun rating</span>
            )}

            {business.phone && (
              <span className="text-xs text-gray-600">📞 {business.phone}</span>
            )}

            {business.website ? (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline truncate max-w-[200px]"
              >
                🌐 {business.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            ) : (
              <span className="text-xs text-red-500 font-medium">🚫 Sito assente</span>
            )}
          </div>

          {business.problems.length > 0 && (
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {business.problems.map((p, i) => (
                <span key={i} className="text-xs bg-gray-100 text-gray-600 rounded-md px-2 py-0.5">
                  {p.label}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => onGenerate(business)}
            disabled={isGenerating}
            className="text-xs bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
          >
            {isGenerating ? 'Genero...' : 'Genera messaggi'}
          </button>
          <button
            onClick={() => onSave(business)}
            className={`text-xs rounded-lg px-4 py-2 transition-colors font-medium border whitespace-nowrap ${
              isSaved
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {isSaved ? '★ Salvata' : '☆ Salva'}
          </button>
        </div>
      </div>
    </div>
  );
}
