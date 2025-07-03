
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Settings } from 'lucide-react';

export interface ModelConfig {
  name: string;
  color: string;
  enabled: boolean;
  prompt: string;
}

interface ModelSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  models: ModelConfig[];
  onUpdateModels: (models: ModelConfig[]) => void;
}

const ModelSettingsDialog: React.FC<ModelSettingsDialogProps> = ({
  open,
  onClose,
  models,
  onUpdateModels
}) => {
  const [editingModels, setEditingModels] = useState<ModelConfig[]>(models);

  const handleSave = () => {
    onUpdateModels(editingModels);
    onClose();
  };

  const handleUpdateModel = (index: number, updates: Partial<ModelConfig>) => {
    setEditingModels(prev => prev.map((model, i) => 
      i === index ? { ...model, ...updates } : model
    ));
  };

  const handleAddModel = () => {
    const newModel: ModelConfig = {
      name: '新模型',
      color: 'bg-gray-500',
      enabled: true,
      prompt: '你是一个专业的AI助手，请以友好、准确的方式回答用户的问题。'
    };
    setEditingModels(prev => [...prev, newModel]);
  };

  const handleDeleteModel = (index: number) => {
    setEditingModels(prev => prev.filter((_, i) => i !== index));
  };

  const colorOptions = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-lime-500', 'bg-amber-500'
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            模型配置
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              配置对比的AI模型和对应的提示词
            </p>
            <Button onClick={handleAddModel} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              添加模型
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {editingModels.map((model, index) => (
              <Card key={index} className="p-4">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={model.enabled}
                        onCheckedChange={(checked) => 
                          handleUpdateModel(index, { enabled: !!checked })
                        }
                      />
                      <Badge className={`${model.color} text-white`}>
                        {model.name}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteModel(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`model-name-${index}`}>模型名称</Label>
                      <Input
                        id={`model-name-${index}`}
                        value={model.name}
                        onChange={(e) => 
                          handleUpdateModel(index, { name: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>颜色</Label>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded ${color} ${
                              model.color === color ? 'ring-2 ring-slate-400' : ''
                            }`}
                            onClick={() => handleUpdateModel(index, { color })}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`model-prompt-${index}`}>提示词</Label>
                    <Textarea
                      id={`model-prompt-${index}`}
                      value={model.prompt}
                      onChange={(e) => 
                        handleUpdateModel(index, { prompt: e.target.value })
                      }
                      className="mt-1 min-h-[80px]"
                      placeholder="输入模型的系统提示词..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave}>
            保存配置
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelSettingsDialog;
