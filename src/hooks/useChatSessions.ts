
import { useState, useEffect } from 'react';
import { ChatSession, Message, ModelResponse } from '@/types/chat';

const STORAGE_KEY = 'ai-chat-sessions';

export const useChatSessions = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // 从localStorage加载会话数据
  useEffect(() => {
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            modelResponses: msg.modelResponses?.map((resp: any) => ({
              ...resp,
              timestamp: new Date(resp.timestamp)
            }))
          }))
        }));
        setSessions(parsedSessions);
        if (parsedSessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(parsedSessions[0].id);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    }
  }, []);

  // 保存会话数据到localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = (title: string = '新对话') => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession;
  };

  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId ? { ...session, ...updates } : session
    ));
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const addMessage = (sessionId: string, message: Message) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages: [...session.messages, message] }
        : session
    ));
  };

  const updateMessage = (sessionId: string, messageId: string, updates: Partial<Message>) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? {
            ...session,
            messages: session.messages.map(msg => 
              msg.id === messageId ? { ...msg, ...updates } : msg
            )
          }
        : session
    ));
  };

  const getCurrentSession = () => {
    return sessions.find(session => session.id === currentSessionId) || null;
  };

  return {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    createNewSession,
    updateSession,
    deleteSession,
    addMessage,
    updateMessage,
    getCurrentSession
  };
};
