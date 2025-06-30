import React, { useState } from 'react';
import { LandingPage } from './landing';
import IDE from './ide';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const [showIDE, setShowIDE] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');
  const [initialType, setInitialType] = useState('');

  const handleCreateApp = (prompt: string, type: string) => {
    setInitialPrompt(prompt);
    setInitialType(type);
    setShowIDE(true);
  };

  const handleBackToLanding = () => {
    setShowIDE(false);
    setInitialPrompt('');
    setInitialType('');
  };

  return (
    <div className="min-h-screen">
      {showIDE ? (
        <IDE 
          initialPrompt={initialPrompt}
          initialType={initialType}
          onBackToLanding={handleBackToLanding}
        />
      ) : (
        <LandingPage onCreateApp={handleCreateApp} />
      )}
      <Toaster />
    </div>
  );
}