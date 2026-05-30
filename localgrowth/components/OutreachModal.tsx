'use client';
import { useState } from 'react';
import { Business, OutreachMessages } from '@/lib/types';

type Tab = 'email' | 'linkedin' | 'whatsapp' | 'phone';

interface Props {
  business: Business;
  outreach: OutreachMessages;
  onClose: () => void;
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { id: 'phone', label: 'Telefono', icon: '📞' },
];

export default function OutreachModal({ business, outreach, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('email');
  const [copied, setCopied] = useState(false);

  const getContent = () =>
    activeTab === 'email'
      ? `OGGETTO: ${outreach.email.subject}\n\n${outreach.email.body}`
      : outreach[activeTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Messaggi Outreach</h2>
            <p className="text-xs text-gray-500 mt-0.5">{business.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            ×
          </button>
        </div>

        <div className="flex gap-1 p-3 pb-0 border-b border-gray-100">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 text-sm px-3 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 font-medium border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'email' && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 font-medium">OGGETTO</p>
              <p className="text-sm text-gray-900">{outreach.email.subject}</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {activeTab === 'email' ? outreach.email.body : outreach[activeTab]}
            </pre>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">Personalizza prima di inviare</p>
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {copied ? '✓ Copiato!' : 'Copia testo'}
          </button>
        </div>
      </div>
    </div>
  );
}
