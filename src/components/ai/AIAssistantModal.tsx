import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  X, 
  Wifi, 
  WifiOff, 
  Bot, 
  User, 
  ShieldCheck, 
  BookOpen, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { UserProfile } from '../../types';
import { searchOfflineResources } from '../../services/offlineSearchService';
import { API_BASE_URL } from '../../services/api';

interface Message {
  id: string;
  sender: 'user' | 'aria';
  text: string;
  source?: string;
  timestamp: string;
}

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  userProfile: UserProfile;
  initialTopic?: string;
}

// Render lightweight formatting without injecting HTML. URLs, emails and emergency
// numbers remain usable on mobile; ordinary text is kept exactly as written.
const renderMessageText = (text: string) => {
  const tokenPattern = /(\*\*[^*]+\*\*|https?:\/\/[^\s<>]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|(?<!\d)(?:112|110|116117|116123)(?!\d))/g;
  return text.split('\n').map((line, lineIndex) => (
    <React.Fragment key={`line-${lineIndex}`}>
      {line.split(tokenPattern).map((part, partIndex) => {
        if (!part) return null;
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={partIndex} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (/^https?:\/\//i.test(part)) {
          const cleanUrl = part.replace(/[),.;!?]+$/, '');
          const trailing = part.slice(cleanUrl.length);
          return <React.Fragment key={partIndex}><a href={cleanUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-emerald-700 dark:text-emerald-300 underline underline-offset-2 break-all">{cleanUrl}</a>{trailing}</React.Fragment>;
        }
        if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(part)) {
          return <a key={partIndex} href={`mailto:${part}`} className="font-semibold text-emerald-700 dark:text-emerald-300 underline underline-offset-2 break-all">{part}</a>;
        }
        if (/^(112|110|116117|116123)$/.test(part)) {
          return <a key={partIndex} href={`tel:${part}`} className="inline-flex items-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 font-extrabold text-emerald-900 dark:text-emerald-100 text-base tracking-wide align-baseline">{part}</a>;
        }
        return <React.Fragment key={partIndex}>{part}</React.Fragment>;
      })}
      {lineIndex < text.split('\n').length - 1 ? '\n' : null}
    </React.Fragment>
  ));
};

const QUICK_SUGGESTIONS = [
  'Quelles pièces pour l’Anmeldung ?',
  'Combien d’heures max pour un Au-Pair ?',
  'J’ai reçu la lettre Rundfunkbeitrag de 18,36 € !',
  'Comment ouvrir un compte bancaire allemand ?',
  'Qui appeler pour une urgence médicale ?',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  userProfile,
  initialTopic,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'aria',
      text: `Salama ${userProfile.name} ! Je suis ARIA, ta conseillère pour ton installation en Allemagne. Que souhaites-tu comprendre aujourd'hui ? (Anmeldung, droits Au-Pair/FSJ, compte bancaire, transports, ou santé ?)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with topic if passed
  useEffect(() => {
    if (initialTopic && isOpen) {
      handleSendMessage(initialTopic);
    }
  }, [initialTopic, isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMsg.text,
            history: messages.slice(-6).map(m => ({
              role: m.sender === 'user' ? 'user' : 'model',
              content: m.text,
            })),
            userProfile,
          }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.reply) {
          const detail = data.message || data.error || `Erreur HTTP ${response.status}`;
          throw new Error(detail);
        }
        const ariaMsg: Message = {
          id: 'aria_' + Date.now(),
          sender: 'aria',
          text: data.reply,
          source: 'Assistant ARIA · Gemini + fiches documentaires locales',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, ariaMsg]);
      } catch (error) {
        // Fallback to offline search if API fails
        fallbackOfflineAnswer(userMsg.text);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Offline Local Search Engine
      setTimeout(() => {
        fallbackOfflineAnswer(userMsg.text);
        setIsLoading(false);
      }, 500);
    }
  };

  const fallbackOfflineAnswer = (query: string) => {
    const results = searchOfflineResources(query, 3);
    let reply = '';
    let ref = 'Recherche locale ARIA (hors ligne)';

    if (results.length > 0) {
      reply = results.map((item, index) => {
        const detailText = item.details.slice(0, item.kind === 'procedure' ? 5 : 4).map(line => `• ${line}`).join('\n');
        return `${index + 1}. ${item.title}\n${item.summary}${detailText ? `\n${detailText}` : ''}\n\nSource/référence : ${item.reference || 'non renseignée'}\n${item.notice}`;
      }).join('\n\n────────────────────\n\n');
      ref = `${results.length} ressource(s) locale(s) consultée(s)`;
    } else {
      reply = `Je n’ai pas trouvé de fiche documentaire locale suffisamment pertinente pour répondre à cette question hors ligne.

Pour éviter de vous donner une information inexacte, je préfère ne pas inventer de démarche ou de délai. Reconnectez-vous à Internet ou consultez une autorité officielle. Vous pouvez aussi reformuler la question avec le nom allemand du document ou de la démarche.`;
    }

    const ariaMsg: Message = {
      id: 'aria_' + Date.now(),
      sender: 'aria',
      text: reply,
      source: ref,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, ariaMsg]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg h-[92vh] sm:h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 bg-gradient-to-r from-[#143627] to-[#1b4332] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-emerald-300">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white leading-tight">Conseillère ARIA</h3>
                {isOnline ? (
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded-full font-semibold">
                    <Wifi className="w-3 h-3 text-emerald-300" />
                    <span>Gemini en direct</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] bg-amber-500/30 text-amber-200 px-1.5 py-0.5 rounded-full font-semibold">
                    <WifiOff className="w-3 h-3 text-amber-300" />
                    <span>Moteur local hors-ligne</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Accompagnement administratif, juridique & quotidien
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-10 min-h-10 p-2 rounded-full text-emerald-200 hover:text-white hover:bg-white/10" aria-label="Fermer l’assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div aria-label="Questions suggérées" className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto overscroll-x-contain no-scrollbar">
          {QUICK_SUGGESTIONS.map((sug, sIdx) => (
            <button
              key={sIdx}
              onClick={() => handleSendMessage(sug)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 text-[11px] font-medium whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-600 transition active:scale-95 shadow-2xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain space-y-4 text-sm">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex min-w-0 flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`min-w-0 max-w-[92%] px-4 py-3.5 rounded-2xl whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-6 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#143627] text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700'
                }`}
              >
                {renderMessageText(msg.text)}
              </div>

              <div className="flex max-w-[92%] flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 px-1 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.source && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold whitespace-normal break-words">
                      {msg.source}
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 max-w-[70%] text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>ARIA consulte la réglementation officielle...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 pb-safe bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pose ta question (ex: démarches, droits, contrat)..."
            className="flex-1 min-w-0 text-sm px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`w-11 h-11 min-w-11 min-h-11 rounded-xl flex items-center justify-center shrink-0 transition active:scale-95 ${
              inputText.trim() && !isLoading
                ? 'bg-[#143627] hover:bg-[#1b4332] text-white shadow-sm'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
