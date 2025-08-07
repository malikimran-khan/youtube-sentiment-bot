import { scrapeComments } from '../scrapers/youtubeScraper.js';
import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';

dotenv.config();

export const analyzeVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    if (!videoUrl) {
      return res.status(400).json({ message: 'videoUrl is required' });
    }

    const comments = await scrapeComments(videoUrl, 50);

    const model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
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

    res.json({ sentimentAnalysis: response, commentsCount: comments.length });
  } catch (err) {
    console.error('Error in analyzeVideo:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
