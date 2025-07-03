
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquareCode } from 'lucide-react';

interface PromptDialogProps {
  prompt: { modelName: string; prompt: string } | null;
  onClose: () => void;
}

const PromptDialog: React.FC<PromptDialogProps> = ({ prompt, onClose }) => {
  return (
    <Dialog open={!!prompt} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareCode className="w-5 h-5" />
            查看提示词内容
            {prompt && (
              <Badge variant="outline" className="ml-2">
                {prompt.modelName}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {prompt && (
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600">模型:</span>
                  <Badge variant="secondary">{prompt.modelName}</Badge>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-slate-600 block mb-2">提示词内容:</span>
                  <div className="bg-white border border-slate-200 rounded-lg p-3">
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {prompt.prompt}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PromptDialog;
