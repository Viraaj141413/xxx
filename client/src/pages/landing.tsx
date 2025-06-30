import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { SparklesIcon, UserIcon, LogOutIcon, CheckIcon, BriefcaseIcon, HeartIcon, FolderIcon } from 'lucide-react';
import { AuthModal } from '@/components/auth-modal';

interface User {
  id: string;
  name: string;
  email: string;
}

interface RecentApp {
  id: string;
  name: string;
  description: string;
  type: string;
  createdAt: string;
  isPublic: boolean;
}

interface LandingPageProps {
  onCreateApp: (prompt: string, type: string) => void;
}

export function LandingPage({ onCreateApp }: LandingPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recentApps, setRecentApps] = useState<RecentApp[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tags = [
    { id: 'personal', label: 'Personal blog', icon: '📝', prompt: 'Create a personal blog website where I can write and share my thoughts, stories, and experiences with a clean, modern design' },
    { id: 'business', label: 'Local business map', icon: '🗺️', prompt: 'Build a local business directory website with an interactive map showing nearby businesses, reviews, and contact information' },
    { id: 'bio', label: 'Link in bio', icon: '🔗', prompt: 'Make a link in bio page with my social media links, portfolio, and important links all in one place with a stylish layout' }
  ];

  useEffect(() => {
    checkAuth();
    if (user) {
      loadRecentApps();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const loadRecentApps = async () => {
    if (!user) return;
    
    try {
      // Get user projects from VIRAAJDATA system
      const response = await fetch(`/api/viraaj/user-projects?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.projects) {
          const recentProjects = data.projects.map((project: any) => ({
            id: project.id || Date.now().toString(),
            name: project.name || 'Untitled App',
            description: project.description || 'No description available',
            type: project.type || 'general',
            createdAt: project.createdAt || new Date().toISOString(),
            isPublic: true
          }));
          setRecentApps(recentProjects.slice(0, 6));
        }
      }
    } catch (error) {
      console.error('Failed to load recent apps:', error);
    }
  };

  const handleAuth = (userData: User) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/viraaj/logout', { method: 'POST' });
      setUser(null);
      setRecentApps([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleTagClick = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      setInputValue(tag.prompt);
      setSelectedTags([tagId]);
    }
  };

  const handleSubmit = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!inputValue.trim()) return;

    const appType = selectedTags.length > 0 ? selectedTags[0] : 'general';
    onCreateApp(inputValue, appType);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col">
      {/* Header */}
      <div className="bg-[#161b22] border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">Peaks</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <UserIcon className="w-4 h-4" />
                  <span>Hi, {user.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <LogOutIcon className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        <div className="w-full max-w-2xl space-y-8">
          {/* Main Heading */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Hi {user ? user.name : ''}, what do you want to make today?
            </h1>
            <p className="text-gray-400 text-lg">
              Describe an app or site you want to create...
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe an app or site you want to create..."
                className="w-full min-h-[120px] bg-[#21262d] border-gray-600 text-white placeholder-gray-400 resize-none text-base p-4 rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="absolute bottom-3 left-3 text-xs text-gray-500 flex items-center space-x-2">
                <SparklesIcon className="w-3 h-3" />
                <span>AI from AIs</span>
                <span>•</span>
                <span>⌘</span>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isLoading}
                className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 px-6"
              >
                Generate
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.id)}
                  variant="outline"
                  size="sm"
                  className={`border-gray-600 hover:border-blue-400 ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-transparent text-gray-300'
                  }`}
                >
                  {selectedTags.includes(tag.id) && <CheckIcon className="w-3 h-3 mr-1" />}
                  <span className="mr-1">{tag.icon}</span>
                  {tag.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Apps Section */}
      {user && (
        <div className="bg-[#0d1117] px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Your recent Apps</h2>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                View All →
              </Button>
            </div>
            
            {recentApps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentApps.map((app) => (
                  <Card key={app.id} className="bg-[#161b22] border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-medium text-white truncate">{app.name}</h3>
                            <p className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-gray-400">Public</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2">{app.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FolderIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recent apps yet. Create your first app above!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuth}
      />
    </div>
  );
}