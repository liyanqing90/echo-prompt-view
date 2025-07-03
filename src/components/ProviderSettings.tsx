
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  Server,
  Globe,
  Zap
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  enabled: boolean;
  models: string[];
  type: 'openai' | 'anthropic' | 'google' | 'custom';
}

const ProviderSettings: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: '1',
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      enabled: true,
      models: ['gpt-4', 'gpt-3.5-turbo'],
      type: 'openai'
    },
    {
      id: '2',
      name: 'Anthropic',
      baseUrl: 'https://api.anthropic.com',
      enabled: false,
      models: ['claude-3-opus', 'claude-3-sonnet'],
      type: 'anthropic'
    },
    {
      id: '3',
      name: '智谱AI',
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      enabled: true,
      models: ['glm-4'],
      type: 'custom'
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProvider, setNewProvider] = useState({
    name: '',
    baseUrl: '',
    enabled: true,
    models: [''],
    type: 'custom' as Provider['type']
  });

  const handleUpdateProvider = (id: string, updates: Partial<Provider>) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(prev => prev.filter(p => p.id !== id));
  };

  const handleAddProvider = () => {
    if (newProvider.name && newProvider.baseUrl) {
      const provider: Provider = {
        id: Date.now().toString(),
        ...newProvider,
        models: newProvider.models.filter(m => m.trim())
      };
      setProviders(prev => [...prev, provider]);
      setNewProvider({
        name: '',
        baseUrl: '',
        enabled: true,
        models: [''],
        type: 'custom'
      });
    }
  };

  const getProviderIcon = (type: Provider['type']) => {
    switch (type) {
      case 'openai':
        return <Zap className="w-5 h-5 text-green-600" />;
      case 'anthropic':
        return <Server className="w-5 h-5 text-orange-600" />;
      case 'google':
        return <Globe className="w-5 h-5 text-blue-600" />;
      default:
        return <Server className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 添加新服务商 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加服务商
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider-name">服务商名称</Label>
              <Input
                id="provider-name"
                value={newProvider.name}
                onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                placeholder="如：OpenAI、Claude等"
              />
            </div>
            <div>
              <Label htmlFor="provider-url">API地址</Label>
              <Input
                id="provider-url"
                value={newProvider.baseUrl}
                onChange={(e) => setNewProvider(prev => ({ ...prev, baseUrl: e.target.value }))}
                placeholder="https://api.example.com/v1"
              />
            </div>
          </div>
          <div>
            <Label>支持的模型（每行一个）</Label>
            <textarea
              className="w-full mt-1 p-2 border rounded-md"
              rows={3}
              value={newProvider.models.join('\n')}
              onChange={(e) => setNewProvider(prev => ({ 
                ...prev, 
                models: e.target.value.split('\n').filter(m => m.trim()) 
              }))}
              placeholder="gpt-4&#10;gpt-3.5-turbo"
            />
          </div>
          <Button onClick={handleAddProvider} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            添加服务商
          </Button>
        </CardContent>
      </Card>

      {/* 现有服务商列表 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">已配置的服务商</h3>
        {providers.map((provider) => (
          <Card key={provider.id} className={`${provider.enabled ? 'border-green-200' : 'border-slate-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={provider.enabled}
                      onCheckedChange={(checked) => 
                        handleUpdateProvider(provider.id, { enabled: !!checked })
                      }
                    />
                    {getProviderIcon(provider.type)}
                    <div>
                      <h4 className="font-medium text-slate-800">{provider.name}</h4>
                      <p className="text-sm text-slate-600">{provider.baseUrl}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={provider.enabled ? "default" : "secondary"}>
                    {provider.enabled ? '已启用' : '已禁用'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingId(provider.id)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProvider(provider.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-slate-600 mb-2">支持的模型：</p>
                <div className="flex flex-wrap gap-1">
                  {provider.models.map((model, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProviderSettings;
