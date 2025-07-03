import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Settings,
  ChevronDown
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChatSession } from '@/types/chat';
import { ModelConfig } from './ModelSettingsDialog';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: (selectedModels?: string[]) => void;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  onOpenModelSettings: () => void;
  models: ModelConfig[];
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onUpdateSession,
  onOpenModelSettings,
  models
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [selectedModelsForNew, setSelectedModelsForNew] = useState<string[]>([]);
  const [modelSelectionOpen, setModelSelectionOpen] = useState(false);

  const enabledModels = models.filter(model => model.enabled);

  const handleStartEdit = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleSaveEdit = () => {
    if (editingSessionId && editingTitle.trim()) {
      onUpdateSession(editingSessionId, { title: editingTitle.trim() });
    }
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('zh-CN', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  const handleCreateWithModels = () => {
    onCreateSession(selectedModelsForNew.length > 0 ? selectedModelsForNew : undefined);
    setSelectedModelsForNew([]);
    setModelSelectionOpen(false);
  };

  const handleModelToggle = (modelName: string, checked: boolean) => {
    if (checked) {
      setSelectedModelsForNew(prev => [...prev, modelName]);
    } else {
      setSelectedModelsForNew(prev => prev.filter(name => name !== modelName));
    }
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800">对话历史</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenModelSettings}
            className="text-slate-600 hover:text-slate-800"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <Popover open={modelSelectionOpen} onOpenChange={setModelSelectionOpen}>
          <PopoverTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              新建对话
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-3">选择参与对话的模型</h4>
                <div className="space-y-2">
                  {enabledModels.map((model) => (
                    <div key={model.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={`new-chat-${model.name}`}
                        checked={selectedModelsForNew.includes(model.name)}
                        onCheckedChange={(checked) => handleModelToggle(model.name, !!checked)}
                      />
                      <label 
                        htmlFor={`new-chat-${model.name}`}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <div className={`w-3 h-3 rounded-full ${model.color}`} />
                        {model.name}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  不选择则使用所有已启用的模型
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModelSelectionOpen(false)}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreateWithModels}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  创建
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">还没有对话历史</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-sm group ${
                  currentSessionId === session.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'hover:bg-slate-50'
                }`}
                onClick={() => onSelectSession(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {editingSessionId === session.id ? (
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="h-6 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={handleSaveEdit}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <h3 className="font-medium text-sm text-slate-800 truncate">
                        {session.title}
                      </h3>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500">
                        {formatDate(session.createdAt)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {session.messages.length} 条消息
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleStartEdit(session)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={() => onDeleteSession(session.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
