'use client';

import ReactMarkdown from 'react-markdown';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'bot';

  return (
    <div
      className={`flex w-full message-appear ${
        isBot ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isBot
            ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
            : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm'
        }`}
      >
        {isBot ? (
          <div className="prose prose-sm max-w-none break-words text-gray-800 prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:leading-relaxed prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-strong:text-gray-900 prose-a:text-blue-600 prose-hr:my-3 prose-blockquote:border-blue-300 prose-blockquote:text-gray-600 prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-xs">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">
            {message.content}
          </div>
        )}
        <div
          className={`text-[10px] mt-1.5 ${
            isBot ? 'text-gray-400' : 'text-blue-200'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
