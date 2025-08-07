import React, { useState } from 'react';
import axios from 'axios';

export default function VideoAnalyzer() {
  const [videoUrl, setVideoUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/analyze', { videoUrl });
      console.log('Analysis result:', res.data);
      setResult(res.data);
    } catch {
      alert('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-[#033a45] mb-4 text-center">YouTube Sentiment Bot</h2>
      <input
        type="text"
        placeholder="Enter YouTube video URL"
        className="w-full border border-gray-300 p-2 rounded focus:ring-[#c0e640] focus:border-[#c0e640]"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <button
        onClick={analyze}
        disabled={!videoUrl || loading}
        className="mt-3 w-full bg-[#c0e640] text-[#033a45] font-semibold py-2 rounded hover:bg-[#afcd39] disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-[#033a45] mb-2">Analysis:</h3>
          <pre className="whitespace-pre-wrap text-gray-800 bg-gray-100 p-4 rounded">
            {result.sentimentAnalysis?.kwargs?.content || 'No analysis content found'}
          </pre>
          <p className="mt-2 text-sm text-gray-600">
            Comments scraped: {result.commentsCount}
          </p>
        </div>
      )}
    </div>
  );
}
