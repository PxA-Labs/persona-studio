'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('ugly, bad anatomy, deformed, blurry');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedImage(null);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, negativePrompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Server Error: ${errorData.error}\n\nDetails: ${errorData.details || ''}`);
      } else {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setGeneratedImage(imageUrl);
      }
    } catch (err) {
      alert(`Client Error: ${err.message}`);
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          Studio.ai
        </div>

        <nav className="nav-links">
          <div className="nav-item active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            Generation
          </div>
          <div className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M3 15h6"/><path d="M3 18h6"/></svg>
            Library
          </div>
          <div className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="m17 5-5-3-5 3"/><path d="m7 19 5 3 5-3"/></svg>
            Automations
          </div>
          <div className="nav-item" style={{ marginTop: 'auto' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1>Generation Studio</h1>
        <p className="subtitle">Craft high-fidelity assets for your influencer using state-of-the-art models.</p>

        <div className="studio-grid">
          {/* Controls Panel */}
          <div className="glass-panel">
            <form onSubmit={handleGenerate}>
              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">Positive Prompt</label>
                <textarea 
                  className="input-field" 
                  rows="5"
                  placeholder="e.g., RAW photo, beautiful 23-year-old taking a selfie in the gym, cinematic lighting, 8k..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label className="input-label">Negative Prompt</label>
                <textarea 
                  className="input-field" 
                  rows="3"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <div className="spinner" /> Synthesizing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    Generate Image
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="preview-window">
              {isGenerating ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div className="spinner-large" />
                  <p style={{ color: 'var(--accent-secondary)', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase' }}>Rendering Model...</p>
                </div>
              ) : generatedImage ? (
                <img 
                  src={generatedImage} 
                  alt="Generated asset" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Awaiting generation parameters...</p>
              )}
            </div>
            
            {generatedImage && (
              <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                <button className="btn-secondary">Save to Library</button>
                <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>Publish to Instagram</button>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .spinner-large {
          width: 50px; height: 50px;
          border: 3px solid rgba(99, 102, 241, 0.2);
          border-top-color: var(--accent-secondary);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
