'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CornerDownLeft, 
  User, 
  Sprout,
  HelpCircle
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  category?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'bot',
    text: 'Namaste! I am KisanGPT, your 24/7 AI Agri-Scientist & Mandi Advisor. Ask me anything about crop diseases, APMC market price trends, fertilizer dosages, or government schemes.',
    time: 'Just now',
    category: 'General'
  }
];

const PRESET_PROMPTS = [
  'Wheat price prediction for next 14 days',
  'Organic cure for yellow rust in wheat',
  'Best Mandi to sell onions with max net profit',
  'How to apply for PM-KISAN 17th installment?',
  'Drip irrigation schedule for 5 acres cotton'
];

export default function KisanGptChat() {
  const { language } = useAppStore();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleVoiceListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    recognition.start();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // AI intelligent answer generation based on keywords
    setTimeout(() => {
      let botResponse = '';
      const q = query.toLowerCase();

      if (q.includes('wheat') && (q.includes('price') || q.includes('rate') || q.includes('prediction'))) {
        botResponse = '🌾 KisanSetu AI Forecast: Wheat (Sharbati) is currently trading at ₹2,540/Qtl in Khanna Mandi. Due to procurement targets and firm flour mill demand, prices are expected to rise +₹240 to peak at ₹2,780 in 14 days. Recommendation: HOLD stock.';
      } else if (q.includes('rust') || (q.includes('yellow') && q.includes('wheat'))) {
        botResponse = '🔬 Yellow Rust Alert: Immediate spray recommended. Mix Propiconazole 25% EC (Tilt) @ 1 ml/Litre of water (200L water/acre). Alternatively, for organic farming, spray 5% Panchagavya + cow urine (10%) fermented with neem leaves.';
      } else if (q.includes('onion') || q.includes('mandi')) {
        botResponse = '🧅 Mandi Optimization: Lasalgaon APMC offers ₹2,150/Qtl with highest liquidity. After factoring transport cost from your location (₹40/Qtl), your net realization is ₹2,110/Qtl, which is ₹85 higher than local village collection agents.';
      } else if (q.includes('pm-kisan') || q.includes('scheme') || q.includes('installment')) {
        botResponse = '🏛️ PM-KISAN Advisory: The 17th installment of ₹2,000 is being disbursed via DBT. Ensure: 1) e-KYC is linked with Aadhaar OTP, 2) Land seeding is marked "YES" on pmkisan.gov.in, 3) Bank account is Aadhaar-enabled NPCI.';
      } else if (q.includes('irrigation') || q.includes('water') || q.includes('drip')) {
        botResponse = '💧 Smart IoT Schedule: Based on today’s soil moisture (38%) and 0% rain forecast, run your drip pump for 45 minutes between 5:30 PM and 6:15 PM. This avoids peak midday evaporation loss and saves 22% energy.';
      } else {
        botResponse = `🌱 KisanSetu AI Recommendation: For "${query}", our agronomy model advises monitoring current field micro-climate data. Maintain optimal soil organic carbon and consult your nearest Krishi Vigyan Kendra (KVK) if pest thresholds cross 5% foliage density.`;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#DCE8D8] flex flex-col h-[560px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D8] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0a150e] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-[#183326]">KisanGPT</h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#E7F3E5] text-[#2E7D4F] font-bold border border-[#DCE8D8]">
                Voice Enabled
              </span>
            </div>
            <p className="text-[11px] text-[#789087]">Indian Agri-LLM fine-tuned on ICAR &amp; APMC databanks</p>
          </div>
        </div>

        {/* Global TTS toggle */}
        <button
          onClick={() => {
            const lastBotMsg = [...messages].reverse().find(m => m.sender === 'bot');
            if (lastBotMsg) speakText(lastBotMsg.text);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F3F8F1] hover:bg-[#E7F3E5] text-xs font-semibold text-[#607568] border border-[#DCE8D8] transition-colors"
          title="Listen to last answer"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-rose-500" />
              <span>Stop Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#2E7D4F]" />
              <span>Read Aloud</span>
            </>
          )}
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 border-b border-[#DCE8D8]">
        <span className="text-[10px] font-bold text-[#789087] uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
        </span>
        {PRESET_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-[#F3F8F1] hover:bg-[#E7F3E5] border border-[#DCE8D8] hover:border-[#2E7D4F]/40 text-[#607568] hover:text-[#2E7D4F] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-[#E7F3E5] border border-[#DCE8D8] flex items-center justify-center shrink-0 mt-0.5">
                <Sprout className="w-4 h-4 text-[#2E7D4F]" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md ${
                m.sender === 'user'
                  ? 'bg-[#2E7D4F] text-white rounded-tr-none'
                  : 'bg-[#F3F8F1] text-[#183326] border border-[#DCE8D8] rounded-tl-none'
              }`}
            >
              <div>{m.text}</div>
              <div className={`flex items-center justify-between mt-1 text-[9px] gap-3 ${m.sender === 'user' ? 'text-white/70' : 'text-[#789087]'}`}>
                <span>{m.time}</span>
                {m.sender === 'bot' && (
                  <button 
                    onClick={() => speakText(m.text)}
                    className="hover:text-[#2E7D4F] flex items-center gap-0.5"
                  >
                    <Volume2 className="w-3 h-3" /> Audio
                  </button>
                )}
              </div>
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#E7F3E5] border border-[#DCE8D8] flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-[#2E7D4F]" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#789087] bg-[#F3F8F1] px-3 py-2 rounded-xl w-fit border border-[#DCE8D8]">
            <div className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] ml-1">KisanGPT is analyzing ICAR &amp; Mandi models...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field & Voice Trigger */}
      <div className="pt-3 border-t border-[#DCE8D8] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceListen}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-[#F3F8F1] hover:bg-[#E7F3E5] text-[#2E7D4F] border-[#DCE8D8]'
            }`}
            title={isListening ? 'Listening... Speak now' : 'Voice Input (Speak in Hindi or English)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Type or speak query (e.g. Mustard sowing advice, Wheat mandi peak price)..."
            className="flex-1 bg-white border border-[#DCE8D8] rounded-xl px-4 py-2.5 text-xs text-[#183326] placeholder:text-[#789087] focus:outline-none focus:border-[#2E7D4F] transition-colors"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-2.5 rounded-xl bg-[#2E7D4F] hover:bg-[#256640] disabled:opacity-40 disabled:hover:bg-[#2E7D4F] text-white font-bold transition-all shadow-md shadow-[#2E7D4F]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
