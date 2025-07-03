
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Bot } from 'lucide-react';
import { ModelResponse } from '@/types/chat';

interface ModelResponseGridProps {
  responses: ModelResponse[];
  models: Array<{ name: string; color: string }>;
  onViewPrompt: (prompt: { modelName: string; prompt: string }) => void;
}

const ModelResponseGrid: React.FC<ModelResponseGridProps> = ({ 
  responses, 
  models, 
  onViewPrompt 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {responses.map((response, index) => {
        const model = models.find(m => m.name === response.modelName);
        return (
          <Card key={response.modelName} className="h-full bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${model?.color || 'bg-gray-400'}`} />
                  <Badge variant="outline" className="text-xs font-medium">
                    {response.modelName}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewPrompt({
                    modelName: response.modelName,
                    prompt: response.prompt
                  })}
                  className="h-6 w-6 p-0 hover:bg-slate-100"
                >
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {response.isLoading ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Bot className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">正在思考...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-4/5" />
                    <div className="h-3 bg-slate-200 rounded animate-pulse w-3/5" />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    {response.content}
                  </p>
                  <p className="text-xs text-slate-400">
                    {response.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ModelResponseGrid;
