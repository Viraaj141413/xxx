import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Loader2, Send, Sparkles, AlertCircle, X, Code, File, Clock } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'conversation' | 'code' | 'error' | 'success';
  filesGenerated?: string[];
}

interface FileCreationState {
  fileName: string;
  content: string;
  isActive: boolean;
  progress: number;
  language: string;
}

interface EnhancedChatProps {
  onFileGenerated?: (fileName: string, content: string, language: string) => void;
  onConsoleLog?: (message: string, type: 'info' | 'error' | 'success') => void;
}

export function EnhancedChat({ onFileGenerated, onConsoleLog }: EnhancedChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: "Hi! I'm your AI assistant powered by GPT-4.1. I can help you build applications, answer questions, and create complete projects with files. What would you like to build today?",
      timestamp: new Date(),
      type: 'conversation'
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [fileCreation, setFileCreation] = useState<FileCreationState>({
    fileName: '',
    content: '',
    isActive: false,
    progress: 0,
    language: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateFileCreation = useCallback(async (fileName: string, content: string, language: string) => {
    setFileCreation({
      fileName,
      content: '',
      isActive: true,
      progress: 0,
      language
    });

    const lines = content.split('\n');
    let currentContent = '';
    
    for (let i = 0; i < lines.length; i++) {
      currentContent += lines[i] + '\n';
      const progress = Math.round((i / lines.length) * 100);
      
      setFileCreation(prev => ({
        ...prev,
        content: currentContent,
        progress
      }));

      // Realistic typing speed with occasional pauses
      const delay = i % 10 === 0 ? 200 : 50;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    setFileCreation(prev => ({ ...prev, isActive: false, progress: 100 }));
    
    if (onFileGenerated) {
      onFileGenerated(fileName, content, language);
    }
  }, [onFileGenerated]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'conversation'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    setErrors([]);

    try {
      // Show thinking stage
      setCurrentStage('🤖 Processing your request...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Detect if user wants to create files
      const shouldGenerateFiles = 
        currentInput.toLowerCase().includes('create') ||
        currentInput.toLowerCase().includes('build') ||
        currentInput.toLowerCase().includes('make') ||
        currentInput.toLowerCase().includes('generate');

      if (shouldGenerateFiles) {
        setCurrentStage('🔗 Connecting to GPT-4.1...');
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentInput }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Request failed');
      }

      setCurrentStage('✅ Response received');
      
      // Check if response contains code
      const codeBlocks = data.response.match(/```[\w+]?\n([\s\S]*?)```/g) || [];
      const filesGenerated: string[] = [];

      if (codeBlocks.length > 0 && shouldGenerateFiles) {
        setCurrentStage('📁 Creating files...');
        
        for (let i = 0; i < codeBlocks.length; i++) {
          const block = codeBlocks[i];
          const languageMatch = block.match(/```(\w+)/);
          const language = languageMatch ? languageMatch[1] : 'text';
          const code = block.replace(/```\w*\n/, '').replace(/```$/, '').trim();
          
          if (code) {
            let fileName = 'file';
            
            // Determine filename based on language
            switch (language.toLowerCase()) {
              case 'html':
                fileName = i === 0 ? 'index.html' : `page${i + 1}.html`;
                break;
              case 'css':
                fileName = i === 0 ? 'styles.css' : `styles${i + 1}.css`;
                break;
              case 'javascript':
              case 'js':
                fileName = i === 0 ? 'script.js' : `script${i + 1}.js`;
                break;
              case 'typescript':
              case 'ts':
                fileName = i === 0 ? 'app.ts' : `app${i + 1}.ts`;
                break;
              case 'python':
              case 'py':
                fileName = i === 0 ? 'main.py' : `module${i + 1}.py`;
                break;
              case 'json':
                fileName = 'package.json';
                break;
              default:
                fileName = `file${i + 1}.${language}`;
            }

            filesGenerated.push(fileName);
            await simulateFileCreation(fileName, code, language);
          }
        }
      }

      // Create AI response
      let responseContent = data.response;
      if (filesGenerated.length > 0) {
        responseContent = responseContent.replace(/```[\w+]?\n([\s\S]*?)```/g, '').trim();
        responseContent += `\n\n✅ Successfully created ${filesGenerated.length} files for you!`;
      }

      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: responseContent,
        timestamp: new Date(),
        type: filesGenerated.length > 0 ? 'code' : 'conversation',
        filesGenerated
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (onConsoleLog) {
        onConsoleLog(`Generated ${filesGenerated.length} files`, 'success');
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      const errorResponse: ChatMessage = {
        id: Date.now().toString(),
        sender: 'ai',
        content: `❌ **API Connection Failed**\n\nError: ${errorMessage}\n\n**Solutions:**\n• Check internet connection\n• Verify GitHub token permissions\n• Try a simpler request\n• Contact support if issue persists\n\nI'll try to help with basic conversation while the API issue is resolved.`,
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorResponse]);
      setErrors(prev => [...prev, errorMessage]);
      
      if (onConsoleLog) {
        onConsoleLog(`API Error: ${errorMessage}`, 'error');
      }
    } finally {
      setIsLoading(false);
      setCurrentStage('');
    }
  }, [inputValue, isLoading, simulateFileCreation, onConsoleLog]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearErrors = () => setErrors([]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Error Banner */}
      {errors.length > 0 && (
        <div className="bg-red-900/50 border-l-4 border-red-500 p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-sm">API connection issues detected</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearErrors}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* File Creation Animation */}
      {fileCreation.isActive && (
        <Card className="bg-gray-800 border-gray-700 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <File className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium">Creating {fileCreation.fileName}</span>
            </div>
            <span className="text-xs text-gray-400">{fileCreation.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${fileCreation.progress}%` }}
            />
          </div>
          <div className="bg-gray-900 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
            <pre className="text-green-400">{fileCreation.content}</pre>
          </div>
        </Card>
      )}

      {/* Status */}
      {currentStage && (
        <div className="flex items-center justify-center py-2 text-sm text-gray-400 bg-gray-800/50">
          <Clock className="w-4 h-4 mr-2" />
          {currentStage}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <Card className={`max-w-[70%] p-3 ${
              message.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : message.type === 'error'
                ? 'bg-red-900/50 border-red-700'
                : message.type === 'code'
                ? 'bg-green-900/30 border-green-700'
                : 'bg-gray-800 border-gray-700 text-gray-100'
            }`}>
              <div className="whitespace-pre-wrap text-sm">
                {message.content}
              </div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
              {message.filesGenerated && message.filesGenerated.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {message.filesGenerated.map((file, index) => (
                    <span key={index} className="bg-green-700 text-xs px-2 py-1 rounded">
                      📄 {file}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything or describe what you want to build..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 flex items-center">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by GPT-4.1 with GitHub integration
        </div>
      </div>
    </div>
  );
}