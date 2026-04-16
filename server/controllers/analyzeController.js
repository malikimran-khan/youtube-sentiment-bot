import { scrapeComments } from '../scrapers/youtubeScraper.js';
import dotenv from 'dotenv';

// Load .env BEFORE any SDK initialization
dotenv.config();

export const analyzeVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ message: 'videoUrl is required' });
    }

    const comments = await scrapeComments(videoUrl, 50);

    // Verify key is actually loaded
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set in your .env file');
    }

    // Import ChatOpenAI AFTER dotenv.config() has run
    const { ChatOpenAI } = await import('@langchain/openai');

    const model = new ChatOpenAI({
      openAIApiKey: apiKey,
      temperature: 0.5,
    });

    const systemPrompt = `You are a helpful assistant that explains things clearly using simple language.`;

    const userPrompt = `Below are YouTube video comments:

${comments.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Please analyze them and:
1. Tell me the **overall feeling** (positive, negative, or neutral).
2. List the **main ideas** or things people are talking about.
3. Give **easy-to-read bullet points** with the most important takeaways.
4. Use **simple words** — explain like you're talking to someone who is not a tech expert.
5. Add a final short summary of how people feel about the video overall.`;

    const response = await model.invoke([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    res.json({
      sentimentAnalysis: response.content, // Extract .content from AIMessage
      commentsCount: comments.length,
    });
  } catch (err) {
    console.error('Error in analyzeVideo:', err.message);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};