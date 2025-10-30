import { Hono } from 'hono'
import Groq from 'groq-sdk' 
import { config } from 'dotenv';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = new Hono()
config();

const prompt = require('fs').readFileSync('prompt.md', 'utf8');

app.get('/', (c) => {
  return c.text('Hello Hono!')
});

app.get('/prompt', async (c) => {
  const response: Groq.Chat.Completions.ChatCompletion = await groq.chat.completions.create(
    {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'llama-3.3-70b-versatile'
    });
  return c.text(response.choices[0]?.message?.content || 'No response');
});

export default app
