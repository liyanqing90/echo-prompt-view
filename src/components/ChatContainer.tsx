
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Eye, User, Bot } from 'lucide-react';
import { Message, ModelResponse } from '@/types/chat';
import MessageBubble from './MessageBubble';
import ModelResponseGrid from './ModelResponseGrid';
import PromptDialog from './PromptDialog';

const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<{ modelName: string; prompt: string } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 模拟的AI模型
  const models = [
    { name: 'GPT-4', color: 'bg-green-500' },
    { name: 'Claude-3', color: 'bg-blue-500' },
    { name: 'Gemini Pro', color: 'bg-purple-500' },
    { name: 'LLaMA-2', color: 'bg-orange-500' }
  ];

  const mockPrompts = {
    'GPT-4': '你是一个专业的AI助手，请以友好、准确的方式回答用户的问题。',
    'Claude-3': '作为Claude AI助手，我将为您提供有帮助、无害且诚实的回答。',
    'Gemini Pro': '我是Google的Gemini AI，致力于为用户提供准确、有用的信息。',
    'LLaMA-2': '作为LLaMA AI助手，我会尽我所能回答您的问题并提供帮助。'
  };

  // 模拟AI回复
  const simulateAIResponse = async (userMessage: string): Promise<ModelResponse[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = models.map(model => ({
          modelName: model.name,
          content: `这是来自${model.name}的回复：${userMessage}。我理解您的问题，这里是我的详细回答...`,
          prompt: mockPrompts[model.name as keyof typeof mockPrompts],
          timestamp: new Date()
        }));
        resolve(responses);
      }, 1000 + Math.random() * 2000); // 随机延迟模拟真实API
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // 创建AI回复消息占位符
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      modelResponses: models.map(model => ({
        modelName: model.name,
        content: '',
        prompt: mockPrompts[model.name as keyof typeof mockPrompts],
        timestamp: new Date(),
        isLoading: true
      }))
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      const responses = await simulateAIResponse(inputValue);
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessage.id 
          ? { ...msg, modelResponses: responses }
          : msg
      ));
    } catch (error) {
      console.error('Error getting AI responses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-800">AI多模型对比</h1>
          </div>
          <div className="flex gap-2">
            {models.map(model => (
              <Badge key={model.name} variant="secondary" className="text-xs">
                <div className={`w-2 h-2 rounded-full ${model.color} mr-1`} />
                {model.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="max-w-7xl mx-auto p-4 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">开始与多个AI模型对话</h3>
                <p className="text-slate-500">输入您的问题，同时获得多个AI模型的回答对比</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <MessageBubble message={message} />
                  {message.type === 'assistant' && message.modelResponses && (
                    <ModelResponseGrid 
                      responses={message.modelResponses}
                      models={models}
                      onViewPrompt={setSelectedPrompt}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="pr-12 py-3 text-base bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            按Enter发送消息 • 同时对比{models.length}个AI模型的回答
          </p>
        </div>
      </div>

      {/* Prompt Dialog */}
      <PromptDialog
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  );
};

export default ChatContainer;
