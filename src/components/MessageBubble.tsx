
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Bot } from 'lucide-react';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start gap-3 max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
            : 'bg-gradient-to-br from-emerald-500 to-teal-600'
        }`}>
          {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
        </div>

        {/* Message Content */}
        <Card className={`${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0' 
            : 'bg-white border-slate-200'
        } shadow-sm`}>
          <CardContent className="p-3">
            <p className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-slate-700'}`}>
              {message.content}
            </p>
            <p className={`text-xs mt-2 ${
              isUser ? 'text-blue-100' : 'text-slate-400'
            }`}>
              {message.timestamp.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessageBubble;
