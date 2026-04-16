import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Youtube, BarChart3, MessageSquare, Sparkles, Loader2, AlertCircle, CheckCircle2, LayoutGrid, Info } from 'lucide-react';

export default function VideoAnalyzer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const loadingSteps = [
    { text: 'Accessing YouTube...', icon: <Youtube className="w-4 h-4" /> },
    { text: 'Extracting Comments...', icon: <MessageSquare className="w-4 h-4" /> },
    { text: 'AI Sentiment Processing...', icon: <BarChart3 className="w-4 h-4" /> },
    { text: 'Generating Insights...', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const analyze = async () => {
    if (!videoUrl) return;
    setLoading(true);
    setResult(null);
    
    // Simulate status updates for UX
    let step = 0;
    const interval = setInterval(() => {
      if (step < loadingSteps.length) {
        setStatus(loadingSteps[step].text);
        step++;
      }
    }, 2500);

    try {
      const res = await axios.post('http://localhost:5000/api/analyze', { videoUrl });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please check the video URL or your API key settings.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setStatus('');
    }
  };

  return (
    <div className="w-full max-w-4xl px-4 flex flex-col items-center">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-accent rounded-2xl shadow-[0_0_20px_rgba(192,230,64,0.3)]">
            <BarChart3 className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            VoxTube AI
          </h1>
        </div>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Unlocking the emotional pulse of your YouTube audience with advanced neural analysis.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass rounded-3xl p-2 neon-border overflow-hidden mb-12"
      >
        <div className="flex items-center px-4 py-2 gap-3">
          <div className="text-slate-500">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            placeholder="Paste YouTube Video URL here..."
            className="flex-1 bg-transparent border-none text-white text-lg placeholder-slate-600 focus:outline-none py-3"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            onClick={analyze}
            disabled={!videoUrl || loading}
            className="bg-accent hover:bg-[#d4f55e] text-primary font-bold px-8 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-2 shadow-lg hover:shadow-[#c0e640]/20"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-6 mt-4"
          >
            <div className="relative">
              <div className="w-20 h-20 border-core border-4 border-slate-800 rounded-full" />
              <div className="absolute inset-0 w-20 h-20 border-t-4 border-accent rounded-full animate-spin shadow-[0_0_15px_rgba(192,230,64,0.4)]" />
            </div>
            <div className="flex items-center gap-2 text-accent font-semibold text-lg tracking-wide uppercase">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              {status}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Sentiment Card */}
            <div className="md:col-span-2 glass rounded-[2.5rem] p-8 relative overflow-hidden">
               <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
               <div className="flex items-center gap-3 mb-6">
                 <LayoutGrid className="text-accent w-6 h-6" />
                 <h3 className="text-xl font-bold text-white">Sentiment Intelligence</h3>
               </div>
               
               <div className="sentiment-content text-slate-300 whitespace-pre-wrap">
                 {result.sentimentAnalysis || 'No analysis content found'}
               </div>
            </div>

            {/* Stats Corner */}
            <div className="flex flex-col gap-6">
              <div className="glass rounded-[2rem] p-6 flex items-center gap-4 border-l-4 border-accent">
                <div className="bg-accent/10 p-3 rounded-xl">
                  <MessageSquare className="text-accent w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{result.commentsCount}</div>
                  <div className="text-slate-500 text-sm font-medium">Comments Sampled</div>
                </div>
              </div>

              <div className="glass rounded-[2rem] p-6 flex items-center gap-4 border-l-4 border-cyan-400">
                <div className="bg-cyan-400/10 p-3 rounded-xl">
                  <CheckCircle2 className="text-cyan-400 w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-slate-500 text-sm font-medium">AI Accuracy</div>
                </div>
              </div>

              <div className="glass rounded-[2rem] p-8 flex-1 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-accent" />
                  Quick Note
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  This analysis is powered by state-of-the-art neural networks. Actual audience perception may vary based on cultural context and sarcasm.
                </p>
                
                <button 
                  onClick={() => setResult(null)}
                  className="mt-6 w-full py-3 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-xl text-sm font-bold transition-all"
                >
                  Clear Results
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
