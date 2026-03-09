import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Briefcase, Mail, Lightbulb, MessageSquareWarning, Menu, Plus, MessageSquare, Trash2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { AcornLogo } from './components/AcornLogo';
import { AboutPage } from './components/AboutPage';
import { sendMessageToGerard } from './services/geminiService';

type Message = {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
};

type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
};

const STORAGE_KEY = 'gerard_ai_conversations';

const QUICK_PROMPTS = [
  { icon: <Briefcase className="w-4 h-4" />, text: "Analyse mon post LinkedIn" },
  { icon: <Mail className="w-4 h-4" />, text: "Écris un email commercial" },
  { icon: <Lightbulb className="w-4 h-4" />, text: "Donne-moi une idée de startup" },
  { icon: <MessageSquareWarning className="w-4 h-4" />, text: "J'ai un problème avec un client" },
];



export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'chat' | 'about'>('chat');



  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
        if (parsed.length > 0) {
          parsed.sort((a: Conversation, b: Conversation) => b.createdAt - a.createdAt);
          setActiveConversationId(parsed[0].id);
        }
      } catch (e) {
        console.error("Failed to parse conversations", e);
      }
    }
  }, []);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleNewConversation = () => {
    setActiveConversationId(null);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setIsSidebarOpen(false);
  };



  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    let currentConvId = activeConversationId;
    let newConversations = [...conversations];

    if (!currentConvId) {
      currentConvId = Date.now().toString();
      const title = text.length > 40 ? text.substring(0, 40) + '...' : text;
      const newConv: Conversation = {
        id: currentConvId,
        title,
        createdAt: Date.now(),
        messages: [userMessage]
      };
      newConversations = [newConv, ...newConversations];
      setActiveConversationId(currentConvId);
    } else {
      newConversations = newConversations.map(c =>
        c.id === currentConvId
          ? { ...c, messages: [...c.messages, userMessage] }
          : c
      );
    }

    setConversations(newConversations);
    setInput('');
    setIsLoading(true);

    const modelMessageId = (Date.now() + 1).toString();
    const initialModelMessage: Message = {
      id: modelMessageId,
      role: 'model',
      content: '',
      timestamp: Date.now(),
      isStreaming: true
    };

    setConversations(prev => prev.map(c =>
      c.id === currentConvId
        ? { ...c, messages: [...c.messages, initialModelMessage] }
        : c
    ));

    let fullContent = '';
    try {
      const history = newConversations.find(c => c.id === currentConvId)?.messages.slice(0, -1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })) || [];

      const stream = await sendMessageToGerard(text, history);

      for await (const chunk of stream) {
        if (chunk.text) {
          fullContent += chunk.text;
          setConversations(prev => prev.map(c =>
            c.id === currentConvId
              ? {
                ...c,
                messages: c.messages.map(msg =>
                  msg.id === modelMessageId ? { ...msg, content: fullContent } : msg
                )
              }
              : c
          ));
        }
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      fullContent = "*(Gérard semble avoir débranché le câble du modem. Veuillez réessayer plus tard.)*";
      setConversations(prev => prev.map(c =>
        c.id === currentConvId
          ? {
            ...c,
            messages: c.messages.map(msg =>
              msg.id === modelMessageId ? { ...msg, content: fullContent } : msg
            )
          }
          : c
      ));
    } finally {
      setConversations(prev => prev.map(c =>
        c.id === currentConvId
          ? {
            ...c,
            messages: c.messages.map(msg =>
              msg.id === modelMessageId ? { ...msg, isStreaming: false } : msg
            )
          }
          : c
      ));
      setIsLoading(false);


    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const scrollToChat = () => {
    chatContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex font-sans bg-beige-50 relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-acorn-900/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-beige-100 border-r border-acorn-900/10 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 flex items-center justify-between">
          <button
            onClick={handleNewConversation}
            className="flex-1 flex items-center gap-2 bg-white hover:bg-beige-50 border border-acorn-900/10 px-4 py-2.5 rounded-xl text-sm font-medium text-acorn-900 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nouvelle discussion
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden ml-2 p-2 text-acorn-900/50 hover:text-acorn-900 hover:bg-acorn-900/5 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${activeConversationId === conv.id
                ? 'bg-acorn-900/5 text-acorn-900 font-medium'
                : 'text-acorn-900/70 hover:bg-acorn-900/5 hover:text-acorn-900'
                }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
                <span className="text-sm truncate">{conv.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteConversation(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-acorn-900/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                title="Supprimer la discussion"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* Subtle background decoration */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-acorn-100/30 to-transparent pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-30 bg-beige-50/80 backdrop-blur-md border-b border-acorn-900/5 shrink-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 text-acorn-900/70 hover:text-acorn-900 hover:bg-acorn-900/5 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('chat')}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <AcornLogo className="w-7 h-7" />
                </div>
                <span className="font-semibold text-lg tracking-tight">Gérard AI</span>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setCurrentPage(currentPage === 'about' ? 'chat' : 'about')}
                className={`text-sm font-medium transition-colors ${currentPage === 'about'
                  ? 'text-caramel-500'
                  : 'text-acorn-900/50 hover:text-acorn-900'
                  }`}
              >
                À propos
              </button>
              <div className="text-xs font-medium text-acorn-900/50 hidden sm:block">
                v1.0 (Année 1998)
              </div>
            </div>
          </div>
        </header>

        {currentPage === 'about' ? (
          <AboutPage onNavigateToChat={() => setCurrentPage('chat')} />
        ) : (
          <>
            <main className="flex-grow flex flex-col">
              {/* Hero Section (Only visible if no messages) */}
              <AnimatePresence>
                {messages.length === 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    className="flex-grow flex flex-col items-center justify-center px-4 py-20 text-center"
                  >
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                      <AcornLogo className="w-14 h-14" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-acorn-900">
                      Gérard AI
                    </h1>
                    <p className="text-xl sm:text-2xl font-medium text-acorn-600 mb-6">
                      L'intelligence pas très artificielle.
                    </p>
                    <p className="max-w-lg text-acorn-900/70 mb-10 text-base sm:text-lg leading-relaxed">
                      Gérard est un ancien commercial de 58 ans qui a découvert l'intelligence artificielle récemment.
                      Il ne comprend pas tout… mais il donne quand même des conseils.
                    </p>

                    <button
                      onClick={scrollToChat}
                      className="bg-acorn-900 hover:bg-acorn-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-sm flex items-center gap-2 group"
                    >
                      <Sparkles className="w-5 h-5 group-hover:text-caramel-400 transition-colors" />
                      Demander conseil à Gérard
                    </button>
                    <p className="mt-4 text-xs text-acorn-900/40 font-medium">
                      Gérard peut donner de mauvais conseils.
                    </p>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Chat Interface */}
              <section
                ref={chatContainerRef}
                className={`flex-grow flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 transition-all duration-500 ${messages.length > 0 ? 'py-8' : 'py-0'}`}
              >
                {/* Messages Area */}
                {messages.length > 0 && (
                  <div className="flex-grow overflow-y-auto mb-6 space-y-6 pb-4">


                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'model' && (
                          <div className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center mt-1">
                            <AcornLogo className="w-8 h-8" />
                          </div>
                        )}

                        <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${msg.role === 'user'
                          ? 'bg-acorn-900 text-white rounded-tr-sm'
                          : 'bg-white border border-acorn-900/10 shadow-sm rounded-tl-sm text-acorn-900'
                          }`}>
                          {msg.role === 'model' ? (
                            <div className="markdown-body text-[15px] leading-relaxed">
                              {msg.content ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              ) : (
                                <div className="flex gap-1 items-center h-6">
                                  <div className="w-2 h-2 bg-acorn-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                  <div className="w-2 h-2 bg-acorn-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                  <div className="w-2 h-2 bg-acorn-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          )}


                        </div>

                        {msg.role === 'user' && (
                          <div className="w-8 h-8 shrink-0 bg-beige-200 text-acorn-700 rounded-lg flex items-center justify-center mt-1">
                            <User className="w-5 h-5" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                {/* Input Area */}
                <div className="mt-auto sticky bottom-6 z-10">
                  <AnimatePresence>
                    {messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, height: 0, overflow: 'hidden' }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
                      >
                        {QUICK_PROMPTS.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSend(prompt.text)}
                            className="flex items-center gap-3 p-4 bg-white border border-acorn-900/10 hover:border-caramel-400/50 hover:bg-caramel-50/30 rounded-xl text-left transition-all text-sm font-medium text-acorn-800 shadow-sm group"
                          >
                            <div className="text-caramel-500 group-hover:scale-110 transition-transform">
                              {prompt.icon}
                            </div>
                            {prompt.text}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative bg-white rounded-2xl shadow-md border border-acorn-900/10 focus-within:border-caramel-400/50 focus-within:ring-4 focus-within:ring-caramel-400/10 transition-all">
                    <textarea
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Posez une question à Gérard..."
                      className="w-full bg-transparent resize-none py-4 pl-5 pr-14 max-h-32 min-h-[56px] outline-none text-acorn-900 placeholder:text-acorn-900/30 text-[15px]"
                      rows={1}
                      maxLength={2000}
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => handleSend(input)}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-3 bottom-3 w-8 h-8 flex items-center justify-center bg-acorn-900 text-white rounded-lg hover:bg-acorn-800 disabled:opacity-50 disabled:hover:bg-acorn-900 transition-colors"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>

                  <div className="text-center mt-3 space-y-1">
                    <p className="text-xs text-acorn-900/40 font-medium flex items-center justify-center gap-1">
                      Gérard a 30 ans d'expérience commerciale… discutable.
                    </p>
                    <p className="text-[10px] text-acorn-900/30">
                      Gérard est une parodie. Ne suivez pas ses conseils.
                    </p>
                  </div>
                </div>
              </section>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-acorn-900/5 mt-12 bg-beige-100/50 shrink-0">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 opacity-50">
                  <AcornLogo className="w-6 h-6" />
                  <span className="text-sm font-semibold">Gérard AI</span>
                </div>
                <p className="text-xs text-acorn-900/40 text-center sm:text-right">
                  Conçu pour rire. Ne prenez pas ses conseils au sérieux.<br />
                  Gérard a découvert l'IA hier soir.
                </p>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

