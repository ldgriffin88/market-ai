import { Hono } from 'hono'
import Groq from 'groq-sdk' 
import { config } from 'dotenv';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = new Hono()
config();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/prompt', async (c) => {
  const response: Groq.Chat.Completions.ChatCompletion = await groq.chat.completions.create(
    {
      messages: [
        {
          role: 'user',
          content: "Create a list of day trades that would be great aggressive buys for a portfolio of $10,000 based on articles form the past week. Highlight positive market sentiment. Include the stock name and ticker. Give it to me in a way I can send to the Alpaca trading API. "
        }
      ],
      model: 'llama-3.3-70b-versatile'
    });
  return c.text(response.choices[0]?.message?.content || 'No response');
});

export default app

