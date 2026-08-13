'use client';

import React, { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';
import { Message } from '@/types';
import { PRESET_QUESTIONS } from '@/data/constants';

export const CyberChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Merhaba! Nexus Labs yapay zeka asistanıyım. Projeniz hakkında merak ettiğiniz bir konu var mı?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: query }]);
    if (!textToSend) setInput('');

    setTimeout(() => {
      const matched = PRESET_QUESTIONS.find((q) =>
        query.toLowerCase().includes(q.question.toLowerCase().split(' ')[0])
      );

      const botReply = matched
        ? matched.answer
        : 'Harika bir soru! Detaylı teknik analiz ve teklif için ekibimiz sizinle iletişime geçebilir.';

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-2xl shadow-blue-600/40 transition-all hover:scale-105 flex items-center justify-center group"
          aria-label="Sohbeti Aç"
        >
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px]">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Nexus AI Assistant</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Çevrimiçi
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 bg-slate-950/50 border-t border-slate-800/60 overflow-x-auto flex gap-1.5 no-scrollbar">
            {PRESET_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSend(q.question)}
                className="whitespace-nowrap text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700/50 transition-colors"
              >
                {q.question}
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Mesajınızı yazın..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button onClick={() => handleSend()} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-xl">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};