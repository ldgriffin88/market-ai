import { Hono } from 'hono'
import Groq from 'groq-sdk' 
import { config } from 'dotenv';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = new Hono()
config();

const prompt = require('fs').readFileSync('prompt.md', 'utf8');
const Alpaca = require('@alpacahq/alpaca-trade-api')
const alpaca = new Alpaca({
  keyId: 'PKIJTWVRGVN5XFXYQQPVGYNLTL',
  secretKey: 'FCbs9rKTNXz9edDPhPJ4cGcCVTcLbuk3s1YTdixhpxKq',
  paper: true,
})

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
  
  const msg = response.choices[0]?.message?.content

  console.log(msg)
  const order = JSON.parse(msg!);

  // alpaca.createOrder(
  // // symbol: string, // any valid ticker symbol
  // // qty: number,
  // // notional: number, // qty or notional required, not both
  // // side: 'buy' | 'sell',
  // // type: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop',
  // // time_in_force: 'day' | 'gtc' | 'opg' | 'ioc',
  // // limit_price: number, // optional,
  // // stop_price: number, // optional,
  // // client_order_id: string, // optional,
  // // extended_hours: boolean, // optional,
  // // order_class: string, // optional,
  // // take_profit: object, // optional,
  // // stop_loss: object, // optional,
  // // trail_price: string, // optional,
  // // trail_percent: string // optional,
  // order[0]
  // ).then((response:any) => {
  // console.log('Current Account:', response)
  // })
});

export default app
