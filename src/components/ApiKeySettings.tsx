
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  Key,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  masked: boolean;
  lastUsed: Date | null;
  isValid: boolean;
}

const ApiKeySettings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'OpenAI主账户',
      provider: 'OpenAI',
      key: 'sk-1234567890abcdef1234567890abcdef',
      masked: true,
      lastUsed: new Date(),
      isValid: true
    },
    {
      id: '2',
      name: '智谱AI测试',
      provider: '智谱AI',
      key: 'zhipu-api-key-example',
      masked: true,
      lastUsed: null,
      isValid: false
    }
  ]);

  const [newKey, setNewKey] = useState({
    name: '',
    provider: '',
    key: ''
  });

  const handleAddKey = () => {
    if (newKey.name && newKey.provider && newKey.key) {
      const apiKey: ApiKey = {
        id: Date.now().toString(),
        ...newKey,
        masked: true,
        lastUsed: null,
        isValid: true
      };
      setApiKeys(prev => [...prev, apiKey]);
      setNewKey({ name: '', provider: '', key: '' });
    }
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  const toggleMask = (id: string) => {
    setApiKeys(prev => prev.map(k => 
      k.id === id ? { ...k, masked: !k.masked } : k
    ));
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 安全提示 */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">安全提示</h4>
              <p className="text-sm text-amber-700 mt-1">
                API密钥非常重要，请妥善保管。建议定期更换密钥，避免在不安全的环境中使用。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 添加新密钥 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            添加API密钥
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="key-name">密钥名称</Label>
              <Input
                id="key-name"
                value={newKey.name}
                onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                placeholder="如：OpenAI主账户"
              />
            </div>
            <div>
              <Label htmlFor="key-provider">服务商</Label>
              <Input
                id="key-provider"
                value={newKey.provider}
                onChange={(e) => setNewKey(prev => ({ ...prev, provider: e.target.value }))}
                placeholder="如：OpenAI、Claude等"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="api-key">API密钥</Label>
            <Input
              id="api-key"
              type="password"
              value={newKey.key}
              onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
              placeholder="输入完整的API密钥"
            />
          </div>
          <Button onClick={handleAddKey} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            添加密钥
          </Button>
        </CardContent>
      </Card>

      {/* 现有密钥列表 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800">已配置的API密钥</h3>
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id} className={`${apiKey.isValid ? 'border-green-200' : 'border-red-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-800">{apiKey.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {apiKey.provider}
                      </Badge>
                      <Badge variant={apiKey.isValid ? "default" : "destructive"} className="text-xs">
                        {apiKey.isValid ? '有效' : '无效'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded font-mono">
                        {apiKey.masked ? maskKey(apiKey.key) : apiKey.key}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleMask(apiKey.id)}
                        className="h-6 w-6 p-0"
                      >
                        {apiKey.masked ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {apiKey.lastUsed ? `最后使用：${apiKey.lastUsed.toLocaleString()}` : '从未使用'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!apiKey.isValid && (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteKey(apiKey.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiKeySettings;
