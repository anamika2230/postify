'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { Message, Niche, Mode, Tool, ConversationState } from '@/types';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import NicheSelector from '@/components/NicheSelector';
import ModeSelector from '@/components/ModeSelector';
import MenuSelector from '@/components/MenuSelector';
import SuggestionBar from '@/components/SuggestionBar';

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function botMsg(content: string): Message {
  return {
    id: createId(),
    role: 'bot',
    content,
    timestamp: new Date(),
  };
}

function userMsg(content: string): Message {
  return {
    id: createId(),
    role: 'user',
    content,
    timestamp: new Date(),
  };
}

const TOOL_QUESTIONS: Record<Tool, string> = {
  'Caption Generator': 'What is your post about? Describe the topic or content of your post.',
  'Hashtag Generator': 'What is your post about? Describe the content you need hashtags for.',
  'Viral Post Ideas': "I'll generate viral post ideas for your niche. Generating...",
  'Hook Generator': 'What is your reel/video about? Describe the topic for your hooks.',
  'Improve Caption': 'Paste the caption you want me to improve:',
  'Best Posting Time': "I'll analyze the best posting times for your niche. Generating...",
  'Trending Topics': "I'll find what's trending in your niche right now. Generating...",
};

// Tools that don't need user input — auto-generate
const AUTO_GENERATE_TOOLS: Tool[] = [
  'Viral Post Ideas',
  'Best Posting Time',
  'Trending Topics',
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [niche, setNiche] = useState<Niche | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [conversationState, setConversationState] =
    useState<ConversationState>('greeting');
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, conversationState, scrollToBottom]);

  // Initial greeting
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setMessages([
      botMsg(
        'Welcome to Postify 🚀\nYour AI Content Assistant.\n\nLet\'s set up your profile first.'
      ),
    ]);
    setConversationState('niche-selection');
  }, []);

  // Call the Gemini API
  const callAPI = useCallback(
    async (tool: Tool, userInput: string) => {
      if (!niche || !mode) return;

      setIsLoading(true);
      setConversationState('generating');

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userInput,
            niche,
            tool,
            mode,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessages((prev) => [
            ...prev,
            botMsg(`❌ ${data.error || 'Something went wrong. Please try again.'}`),
          ]);
          setConversationState('suggestions');
        } else {
          setMessages((prev) => [...prev, botMsg(data.response)]);
          setConversationState('suggestions');
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          botMsg('❌ Network error. Please check your connection and try again.'),
        ]);
        setConversationState('suggestions');
      } finally {
        setIsLoading(false);
      }
    },
    [niche, mode]
  );

  // Handle niche selection
  const handleNicheSelect = (selectedNiche: Niche) => {
    setNiche(selectedNiche);
    setMessages((prev) => [
      ...prev,
      userMsg(selectedNiche),
      botMsg(
        `Great! You're a ${selectedNiche} creator ✨\n\nNow, what type of content are you posting today?`
      ),
    ]);
    setConversationState('mode-selection');
  };

  // Handle mode selection
  const handleModeSelect = (selectedMode: Mode) => {
    setMode(selectedMode);
    const modeLabel =
      selectedMode === 'creative' ? 'Creative Content' : 'Trending / News Content';
    setMessages((prev) => [
      ...prev,
      userMsg(modeLabel),
      botMsg(
        `${selectedMode === 'creative' ? '🎨' : '📈'} ${modeLabel} mode activated!\n\nHere's your Postify Menu. What do you want to create?`
      ),
    ]);
    setConversationState('menu');
  };

  // Handle tool selection from menu
  const handleToolSelect = useCallback(
    (tool: Tool) => {
      setSelectedTool(tool);
      const question = TOOL_QUESTIONS[tool];

      setMessages((prev) => [...prev, userMsg(tool), botMsg(question)]);

      if (AUTO_GENERATE_TOOLS.includes(tool)) {
        // These tools don't need user input — fire immediately
        setConversationState('generating');
        callAPI(tool, `Generate ${tool.toLowerCase()} content`);
      } else {
        setConversationState('awaiting-input');
      }
    },
    [callAPI]
  );

  // Handle change niche from menu
  const handleChangeNiche = () => {
    setMessages((prev) => [
      ...prev,
      userMsg('Change Niche'),
      botMsg('Select your new content niche:'),
    ]);
    setConversationState('niche-selection');
  };

  // Handle change mode from menu
  const handleChangeMode = () => {
    setMessages((prev) => [
      ...prev,
      userMsg('Change Mode'),
      botMsg('What type of content are you posting today?'),
    ]);
    setConversationState('mode-selection');
  };

  // Show menu
  const showMenu = useCallback(() => {
    setSelectedTool(null);
    setMessages((prev) => [
      ...prev,
      botMsg('📋 POSTIFY MENU\n\nWhat do you want to create?'),
    ]);
    setConversationState('menu');
  }, []);

  // Handle suggestion selection
  const handleSuggestion = useCallback(
    (tool: Tool) => {
      handleToolSelect(tool);
    },
    [handleToolSelect]
  );

  // Handle sending a message
  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Check for commands
    if (trimmed.toLowerCase() === '/menu') {
      setMessages((prev) => [...prev, userMsg('/menu')]);
      setInputValue('');
      showMenu();
      return;
    }

    if (trimmed.toLowerCase() === '/reset') {
      setMessages([
        botMsg(
          'Welcome to Postify 🚀\nYour AI Content Assistant.\n\nLet\'s set up your profile first.'
        ),
      ]);
      setNiche(null);
      setMode(null);
      setSelectedTool(null);
      setConversationState('niche-selection');
      setInputValue('');
      return;
    }

    // Normal message when awaiting input for a tool
    if (conversationState === 'awaiting-input' && selectedTool) {
      setMessages((prev) => [...prev, userMsg(trimmed)]);
      setInputValue('');
      callAPI(selectedTool, trimmed);
      return;
    }

    // If user types something unexpected, prompt them
    setMessages((prev) => [
      ...prev,
      userMsg(trimmed),
      botMsg('Type /menu to open the Postify Menu, or /reset to start over.'),
    ]);
    setInputValue('');
  };

  // Determine input placeholder and visibility
  const showInput =
    conversationState === 'awaiting-input' ||
    conversationState === 'suggestions' ||
    conversationState === 'menu';

  const placeholder =
    conversationState === 'awaiting-input'
      ? 'Type your response...'
      : 'Type /menu for tools...';

  return (
    <div className="flex h-dvh flex-col bg-gray-50">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-lg font-bold text-white">
            P
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Postify</h1>
            <p className="text-xs text-gray-500">AI Content Assistant</p>
          </div>
          {niche && (
            <div className="ml-auto flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                {niche}
              </span>
              {mode && (
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {mode === 'creative' ? '🎨 Creative' : '📈 Trending'}
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Interactive selectors rendered inline after messages */}
          {conversationState === 'niche-selection' && (
            <NicheSelector onSelect={handleNicheSelect} />
          )}

          {conversationState === 'mode-selection' && (
            <ModeSelector onSelect={handleModeSelect} />
          )}

          {conversationState === 'menu' && (
            <MenuSelector
              onSelectTool={handleToolSelect}
              onChangeNiche={handleChangeNiche}
              onChangeMode={handleChangeMode}
            />
          )}

          {conversationState === 'suggestions' && !isLoading && (
            <SuggestionBar
              onSelectTool={handleSuggestion}
              onMainMenu={showMenu}
            />
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start message-appear">
              <div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3">
                <div className="typing-dots flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                  <span className="h-2 w-2 rounded-full bg-gray-400" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      {showInput && (
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isLoading}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
