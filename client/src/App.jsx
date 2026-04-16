import React from 'react'
import VideoAnalyzer from './components/VideoAnalyzer'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="bg-gradient-animate" />
      <div className="blob top-[-10%] left-[-10%]" />
      <div className="blob bottom-[-10%] right-[-10%] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,rgba(0,0,0,0)_70%)]" />
      
      <main className="relative z-10 w-full flex items-center justify-center py-12">
        <VideoAnalyzer />
      </main>
      
      {/* Footer Branding */}
      <div className="fixed bottom-6 text-slate-500 text-sm font-medium tracking-wider uppercase opacity-50">
        VoxTube AI • Sentiment Intelligence
      </div>
    </div>
  )
}
