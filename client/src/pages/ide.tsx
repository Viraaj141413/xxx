
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { UserIcon, LogOutIcon, SparklesIcon, FolderIcon, FileIcon, PlayIcon, Send, Loader2, MessageSquare, Code, Eye, Home, FileText } from 'lucide-react';
import { AuthModal } from '@/components/auth-modal';

interface IDEProps {
  initialPrompt?: string;
  initialType?: string;
  onBackToLanding?: () => void;
}

interface FileItem {
  name: string;
  content: string;
  language: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  files?: Record<string, FileItem>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function IDE({ initialPrompt = '', initialType = '', onBackToLanding }: IDEProps) {
  const [user, setUser] = useState<User | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<Record<string, FileItem>>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Hey! 👋 What do you want to build today? I can create websites, apps, games, calculators, and more!',
      timestamp: new Date()
    }
  ]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Handle file tab operations
  const openFileTab = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs(prev => [...prev, fileName]);
    }
    setActiveTab(fileName);
  };

  const closeFileTab = (fileName: string) => {
    setOpenTabs(prev => prev.filter(tab => tab !== fileName));
    if (activeTab === fileName) {
      const remainingTabs = openTabs.filter(tab => tab !== fileName);
      setActiveTab(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : null);
    }
  };

  // Check if user is logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Handle initial prompt from landing page
  useEffect(() => {
    if (initialPrompt && user) {
      setInputMessage(initialPrompt);
      // Auto-generate app if we have both prompt and user
      setTimeout(() => {
        handleSendMessage();
      }, 500);
    }
  }, [initialPrompt, user]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.log('Not logged in');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const currentInput = inputMessage;
    setInputMessage('');
    setIsGenerating(true);

    // Add initial progress message with live coding animation
    const progressMessageId = `progress-${Date.now()}-${Math.random()}`;
    const progressMessage: ChatMessage = {
      id: progressMessageId,
      sender: 'ai',
      content: '🤖 AI Developer is starting to code your application...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, progressMessage]);

    // Start live coding animation
    let animationStep = 0;
    const codingSteps = [
      '🔍 Analyzing your requirements...',
      '📋 Planning application architecture...',
      '⚡ Connecting to advanced AI systems...',
      '💻 Writing HTML structure...',
      '🎨 Designing CSS styles...',
      '⚙️ Implementing JavaScript logic...',
      '🔧 Optimizing performance...',
      '✨ Adding final touches...'
    ];

    const animationInterval = setInterval(() => {
      if (animationStep < codingSteps.length && isGenerating) {
        setMessages(prev => prev.map(msg => 
          msg.id === progressMessageId 
            ? { ...msg, content: `${codingSteps[animationStep]}\n\n💭 AI is actively writing code for you...` }
            : msg
        ));
        animationStep++;
      }
    }, 2000);

    try {
      // Use main chat endpoint with external API integration
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          type: 'general'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Clear animation interval
        clearInterval(animationInterval);
        
        // Update final message to show completion
        setMessages(prev => prev.map(msg => 
          msg.id === progressMessageId 
            ? { ...msg, content: '✅ Application generated successfully! Files are ready in the editor.' }
            : msg
        ));

        // Animate file creation with typing effect
        if (data.files && Object.keys(data.files).length > 0) {
          const fileKeys = Object.keys(data.files);
          let fileIndex = 0;
          
          const fileAnimationInterval = setInterval(() => {
            if (fileIndex < fileKeys.length) {
              const currentFiles: any = {};
              for (let i = 0; i <= fileIndex; i++) {
                currentFiles[fileKeys[i]] = (data.files as any)[fileKeys[i]];
              }
              setFiles(currentFiles);
              
              if (fileIndex === 0) {
                setActiveFile(fileKeys[0]);
              }
              
              // Add chat message for each file creation
              const fileMessage: ChatMessage = {
                id: `file-${Date.now()}-${Math.random()}-${fileIndex}`,
                sender: 'ai',
                content: `📄 Created: ${fileKeys[fileIndex]}`,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, fileMessage]);
              
              fileIndex++;
            } else {
              clearInterval(fileAnimationInterval);
              
              // Add live preview after all files are created
              setTimeout(() => {
                const previewMessage: ChatMessage = {
                  id: `preview-${Date.now()}-${Math.random()}`,
                  sender: 'ai',
                  content: '🌐 Live preview is now available! Click on index.html to see your app running.',
                  timestamp: new Date()
                };
                setMessages(prev => [...prev, previewMessage]);
              }, 1000);
            }
          }, 800);
        }
      } else {
        clearInterval(animationInterval);
        throw new Error(data.error || 'Generation failed');
      }
      
    } catch (error) {
      console.error('App generation error:', error);
      clearInterval(animationInterval);
      setMessages(prev => prev.map(msg => 
        msg.id === progressMessageId 
          ? { ...msg, content: 'App generation encountered an issue. Please try again.' }
          : msg
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/viraaj/logout', { method: 'POST' });
      setUser(null);
      setFiles({});
      setMessages([{
        id: '1',
        sender: 'ai',
        content: 'Hey! 👋 What do you want to build today? I can create websites, apps, games, calculators, and more!',
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleHome = () => {
    if (onBackToLanding) {
      onBackToLanding();
    } else {
      // Reset to initial landing page state
      setFiles({});
      setActiveFile('');
      setInputMessage('');
      setMessages([{
        id: '1',
        sender: 'ai',
        content: 'Hey! 👋 What do you want to build today? I can create websites, apps, games, calculators, and more!',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Top Header */}
      <div className="bg-[#161b22] border-b border-gray-700 p-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleHome}
            className="text-slate-400 hover:text-white hover:bg-slate-700 p-2"
          >
            <Home className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-5 h-5 text-blue-400" />
            <span className="font-semibold">Peaks</span>
          </div>
        </div>
        
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span className="text-slate-200 text-sm">{user.name}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOutIcon className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => setShowAuthModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>

      {/* Main 3-Panel Layout */}
      <div className="flex-1 flex">
        {/* Chat Panel - Dominant Left Side */}
        <div className="w-3/5 flex flex-col border-r border-gray-700">
          {/* Chat Header */}
          <div className="bg-[#161b22] border-b border-gray-700 p-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">Chat</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-[#161b22] border border-gray-700'
                }`}>
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-[#161b22] border border-gray-700 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Creating your app...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-700 bg-[#0d1117]">
            <div className="flex space-x-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="💬 Describe what you want to build..."
                className="flex-1 bg-[#161b22] border-gray-600 text-white text-sm h-12 px-4"
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 h-12 px-6"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Files + Preview */}
        <div className="w-2/5 flex">
          {/* Files Panel - Compact */}
          <div className="w-40 bg-[#161b22] border-r border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center space-x-2">
                <FolderIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Files</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {Object.keys(files).length === 0 ? (
                <div className="text-center text-gray-400 text-xs mt-4">
                  No files yet
                </div>
              ) : (
                Object.entries(files).map(([filename, file]) => (
                  <div
                    key={filename}
                    onClick={() => {
                      setActiveFile(filename);
                      openFileTab(filename);
                    }}
                    className={`flex items-center px-2 py-1.5 cursor-pointer hover:bg-gray-700 rounded text-xs transition-colors ${
                      activeFile === filename ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                    }`}
                    title={filename}
                  >
                    <FileIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate text-xs">{filename}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preview Panel - Remaining Space */}
          <div className="flex-1 flex flex-col">
            {/* Tabs Header */}
            <div className="bg-[#161b22] border-b border-gray-700">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">Preview</span>
                </div>
              </div>
              
              {/* File Tabs */}
              {openTabs.length > 0 && (
                <div className="flex border-b border-gray-700">
                  <div
                    className={`px-3 py-2 text-xs cursor-pointer border-r border-gray-700 ${
                      activeTab === null ? 'bg-gray-700 text-green-400' : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab(null)}
                  >
                    Live Preview
                  </div>
                  {openTabs.map((fileName) => (
                    <div
                      key={fileName}
                      className={`flex items-center px-3 py-2 text-xs cursor-pointer border-r border-gray-700 max-w-32 ${
                        activeTab === fileName ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span
                        className="truncate flex-1"
                        onClick={() => setActiveTab(fileName)}
                      >
                        {fileName}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeFileTab(fileName);
                        }}
                        className="ml-2 text-gray-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {activeTab === null ? (
                // Live Preview Mode
                <div className="h-full bg-white">
                  {files['index.html'] ? (
                    <iframe
                      srcDoc={files['index.html'].content}
                      className="w-full h-full border-0"
                      title="Live Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No preview available</p>
                        <p className="text-sm">Chat with AI to create an app</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Code View Mode
                <div className="h-full bg-[#0d1117] overflow-auto">
                  {activeTab && files[activeTab] ? (
                    <div className="p-4">
                      <div className="mb-2 text-xs text-gray-500 uppercase tracking-wide">
                        {activeTab} - {files[activeTab].language || 'text'}
                      </div>
                      <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {files[activeTab].content}
                      </pre>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>File not found</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onSuccess={(userData) => {
            setUser(userData);
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}
