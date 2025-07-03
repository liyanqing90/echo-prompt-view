
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Settings, 
  MessageSquare, 
  Bot, 
  Server,
  Key
} from 'lucide-react';
import ChatContainer from './ChatContainer';
import ModelSettingsDialog from './ModelSettingsDialog';
import ProviderSettings from './ProviderSettings';
import ApiKeySettings from './ApiKeySettings';

interface MainLayoutProps {}

type ViewType = 'chat' | 'models' | 'providers' | 'apikeys';

const MainLayout: React.FC<MainLayoutProps> = () => {
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  const [modelSettingsOpen, setModelSettingsOpen] = useState(false);

  const navigationItems = [
    { id: 'chat', label: '对话', icon: MessageSquare },
    { id: 'models', label: '模型设置', icon: Bot },
    { id: 'providers', label: '服务商设置', icon: Server },
    { id: 'apikeys', label: 'API密钥', icon: Key },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return <ChatContainer />;
      case 'models':
        return <ModelSettingsDialog open={true} onClose={() => setCurrentView('chat')} models={[]} onUpdateModels={() => {}} />;
      case 'providers':
        return <ProviderSettings />;
      case 'apikeys':
        return <ApiKeySettings />;
      default:
        return <ChatContainer />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 侧边导航 */}
      <div className="w-64 bg-white border-r border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            AI对比平台
          </h1>
          <p className="text-sm text-slate-600 mt-1">多模型智能对话</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
                onClick={() => setCurrentView(item.id as ViewType)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="p-3 bg-gradient-to-r from-blue-50 to-purple-50">
            <p className="text-xs text-slate-600 mb-2">当前状态</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-700">系统正常</span>
            </div>
          </Card>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部标题栏 */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {navigationItems.find(item => item.id === currentView)?.label}
            </h2>
            <p className="text-sm text-slate-600">
              {currentView === 'chat' && '开始您的AI对话'}
              {currentView === 'models' && '配置AI模型参数'}
              {currentView === 'providers' && '管理服务商配置'}
              {currentView === 'apikeys' && '设置API访问密钥'}
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setModelSettingsOpen(true)}
          >
            <Settings className="w-4 h-4" />
            快捷设置
          </Button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>

      {/* 模型设置弹窗 */}
      <ModelSettingsDialog
        open={modelSettingsOpen}
        onClose={() => setModelSettingsOpen(false)}
        models={[]}
        onUpdateModels={() => {}}
      />
    </div>
  );
};

export default MainLayout;
